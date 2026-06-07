CREATE OR REPLACE PROCEDURE "usp_RunPayroll"(
    p_month INT, 
    p_year INT, 
    INOUT p_new_run_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Prevent duplicate payroll runs for the same period
    IF EXISTS (SELECT 1 FROM "PayrollRun" WHERE "month" = p_month AND "year" = p_year) THEN
        RAISE EXCEPTION 'A payroll run for this month and year has already been finalized.' 
        USING ERRCODE = 'P0001';
    END IF;

    -- 2. Create the Master Payroll Run Record
    INSERT INTO "PayrollRun" ("month", "year", "runDate")
    VALUES (p_month, p_year, CURRENT_TIMESTAMP)
    RETURNING "id" INTO p_new_run_id;

    -- 3. Calculate and Save Individual Payslips
    INSERT INTO "PayrollDetail" (
        "payrollRunId", "employeeId", "basicSalary", "workingDays", "daysPresent", 
        "grossPay", "pfDeduction", "professionalTax", "netPay"
    )
    WITH SalaryCalc AS (
        -- Calculate the work ratio once for the entire query
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
        -- Pro-rated Earnings
        CAST("basicSalary" * "ratio" AS NUMERIC(10,2)) AS "grossPay",
        -- Pro-rated PF Deduction (12%)
        CAST(("basicSalary" * 0.12) * "ratio" AS NUMERIC(10,2)) AS "pfDeduction",
        -- Pro-rated Tax
        CAST(200.00 * "ratio" AS NUMERIC(10,2)) AS "professionalTax",
        -- Factored Net Pay: ((Basic * 0.88) - 200) * Ratio
        CAST((("basicSalary" * 0.88) - 200.00) * "ratio" AS NUMERIC(10,2)) AS "netPay"
    FROM SalaryCalc;
END;
$$;