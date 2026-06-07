import { prisma } from '../config/db.js';

export default class PayrollRepository {
    /**
     * Fetch all employees along with their associated department details
     */

    static async executePayrollRun(month, year) {
        // The raw SQL call defined in our previous step
        try {
            const result = await prisma.$queryRaw`CALL "usp_RunPayroll"(${month}, ${year}, null);`;
            return result[0].p_new_run_id;
        } catch (error) {
            // If the error code is our custom 'P0001', throw it up
            if (error.code === 'P0001') {
                throw new Error('DUPLICATE_PAYROLL_RUN'); // Throw a standard ENUM-like string

            }
            throw error; // Let other errors bubble up as-is
        }
    }


    static async getPayrollRun(month, year) {
        return await prisma.payrollRun.findUnique({
            where: {
                month_year: { month, year }, // Matches your @@unique([month, year])
            },
            select: {
                id: true,
                month: true,
                year: true,
                runDate: true,
                payrollDetails: {
                    select: {
                        employeeId: true,
                        // Select name from the related Employee model
                        employee: {
                            select: {
                                // id : true,
                                name: true
                            }
                        },
                        basicSalary: true,
                        workingDays: true,
                        daysPresent: true,
                        grossPay: true,
                        pfDeduction: true,
                        professionalTax: true,
                        netPay: true
                    }
                }
            }
        });
    }

    static async getPayslip(runId, employeeId) {
        return await prisma.payrollDetail.findFirst({
            where: {
                payrollRunId: runId,
                employeeId: employeeId,
            },
            // Optionally include relations if you need to return employee name or run details
            select: {
                // Specific fields from PayrollDetail
                basicSalary: true,
                workingDays: true,
                daysPresent: true,
                grossPay: true,
                pfDeduction: true,
                professionalTax: true,
                netPay: true,
                // Include relations as nested objects
                employee: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                payrollRun: {
                    select: {
                        month: true,
                        year: true
                    }
                }
            }
        });
    }

    // payroll.repository.ts

}