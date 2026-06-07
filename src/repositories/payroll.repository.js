import { prisma } from '../config/db.js';

export default class PayrollRepository {
    /**
     * Fetch all employees along with their associated department details
     */

    static async executePayrollRun(month, year) {
        // 1. Pre-check for duplicate (Safety first)
        const existingRun = await prisma.payrollRun.findFirst({
            where: { year, month }
        });

        if (existingRun)
            throw new Error('DUPLICATE_PAYROLL_RUN');

        // 2. Execute the procedure
        // Use $executeRaw because Procedures do not return results directly
        await prisma.$executeRaw`CALL "usp_RunPayroll"(${month}, ${year}, null);`;

        // 3. Fetch the ID of the run we just created
        const newRun = await prisma.payrollRun.findFirst({
            where: { year, month },
            select: { id: true }
        });

        return newRun.id;
    }


    static async getPayrollRun(month, year) {
        return await prisma.payrollRun.findUnique({
            where: {
                year_month: { year, month }, // Matches your @@unique([month, year])
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