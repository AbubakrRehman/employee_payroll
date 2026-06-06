// 1. Schema for: GET /api/employees
// export const getPayrollByPeriodSchema = z.object({
//     params: z.object({
//         // month must be a numeric string that converts to a number between 1 and 12
//         month: z.string()
//             .regex(/^\d+$/, "Month must be a valid number")
//             .transform(Number)
//             .pipe(z.number().min(1).max(12)),

//         // year must be a numeric string of exactly 4 digits
//         year: z.string()
//             .regex(/^\d{4}$/, "Year must be a 4-digit number")
//             .transform(Number)
//     })
// });