CREATE OR REPLACE PROCEDURE "usp_RunPayroll"(
    p_month INT, 
    p_year INT, 
    INOUT p_new_run_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Immutability & Conflict Check
    -- Checking against "PayrollRun" table using camelCase "month" and "year"
    IF EXISTS (SELECT 1 FROM "PayrollRun" WHERE "year" = p_year AND "month" = p_month) THEN
        RAISE EXCEPTION 'A payroll run for this month and year has already been finalized.' 
        USING ERRCODE = 'P0001';
    END IF;

    -- 2. Create the Master Payroll Run Record
    INSERT INTO "PayrollRun" ("month", "year", "runDate")
    VALUES (p_month, p_year, CURRENT_TIMESTAMP)
    RETURNING "id" INTO p_new_run_id;

    -- 3. Calculate and Save Individual Payslips
    -- Matching your schema fields exactly: employeeId, basicSalary, totalWorkingDays, daysPresent
    INSERT INTO "PayrollDetail" (
        "payrollRunId", "employeeId", "basicSalary", "workingDays", "daysPresent", 
        "grossPay", "pfDeduction", "professionalTax", "netPay"
    )
    SELECT 
        p_new_run_id,
        e."id",
        e."basicSalary",
        COALESCE(a."totalWorkingDays", 0),
        COALESCE(a."daysPresent", 0),
        
        -- Gross Pay
        CAST(
            COALESCE(
                (e."basicSalary" / NULLIF(CAST(a."totalWorkingDays" AS NUMERIC(10,2)), 0)) * a."daysPresent", 
                0
            ) AS NUMERIC(10,2)
        ),
        
        -- PF Deduction (12% of basicSalary)
        CAST(e."basicSalary" * 0.12 AS NUMERIC(10,2)),
        
        -- Professional Tax
        200.00,
        
        -- Net Pay
        CAST(
            COALESCE(
                (e."basicSalary" / NULLIF(CAST(a."totalWorkingDays" AS NUMERIC(10,2)), 0)) * a."daysPresent", 
                0
            ) - (e."basicSalary" * 0.12) - 200.00 
        AS NUMERIC(10,2))

    FROM "Employee" e
    LEFT JOIN "Attendance" a ON e."id" = a."employeeId" 
                             AND a."month" = p_month 
                             AND a."year" = p_year
    WHERE e."isActive" = true;

END;
$$;