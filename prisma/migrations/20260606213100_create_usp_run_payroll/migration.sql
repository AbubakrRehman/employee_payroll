CREATE OR REPLACE PROCEDURE "usp_RunPayroll"(
    p_month INT, 
    p_year INT, 
    INOUT p_new_run_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Create the Master Payroll Run Record (Validation is now handled by Node.js)
    INSERT INTO "PayrollRun" ("month", "year", "runDate")
    VALUES (p_month, p_year, CURRENT_TIMESTAMP)
    RETURNING "id" INTO p_new_run_id;

    -- 2. Calculate and Save Individual Payslips
    INSERT INTO "PayrollDetail" (
        "payrollRunId", "employeeId", "basicSalary", "workingDays", "daysPresent", 
        "grossPay", "pfDeduction", "professionalTax", "netPay"
    )
    WITH SalaryCalc AS (
        SELECT 
            e."id" AS "employeeId",
            e."basicSalary",
            COALESCE(a."totalWorkingDays", 0) AS "workingDays",
            COALESCE(a."daysPresent", 0) AS "daysPresent",
            COALESCE(CAST(a."daysPresent" AS NUMERIC(10,4)) / NULLIF(CAST(a."totalWorkingDays" AS NUMERIC(10,4)), 0), 0) AS "ratio"
        FROM "Employee" e
        LEFT JOIN "Attendance" a ON e."id" = a."employeeId" AND a."month" = p_month AND a."year" = p_year
        WHERE e."isActive" = true
    )
    SELECT 
        p_new_run_id,
        "employeeId",
        "basicSalary",
        "workingDays",
        "daysPresent",
        CAST("basicSalary" * "ratio" AS NUMERIC(10,2)),
        CAST(("basicSalary" * 0.12) * "ratio" AS NUMERIC(10,2)),
        CAST(200.00 * "ratio" AS NUMERIC(10,2)),
        CAST((("basicSalary" * 0.88) - 200.00) * "ratio" AS NUMERIC(10,2))
    FROM SalaryCalc;
END;
$$;