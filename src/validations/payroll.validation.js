import { z } from "zod";


// 1. Schema for: GET /api/payroll/:month/:year
export const getPayrollByPeriodSchema = z.object({
    params: z.object({
        // month must be a numeric string that converts to a number between 1 and 12
        month: z.string()
            .regex(/^\d+$/, "Month must be a valid number")
            .transform(Number)
            .pipe(z.number().min(1).max(12)),

        // year must be a numeric string of exactly 4 digits
        year: z.string()
            .regex(/^\d{4}$/, "Year must be a 4-digit number")
            .transform(Number)
    })
});

// 2. Schema for: GET /api/payroll/:runId/slip/:employeeId
export const getEmployeePayslipSchema = z.object({
    params: z.object({
        runId: z.string(), // Assumes UUIDs for database IDs
        employeeId: z.string().min(1, "Employee ID is required")
    })
});

// 3. Schema for: POST /api/payroll (Example of validating a request body)
export const createPayrollSchema = z.object({
    body: z.object({
        month: z.number().int().min(1).max(12),
        year: z.number().int().min(2020).max(2100)
    })
});


