import { departmentRecords, employeeRecords, attendanceRecords, payrollRunRecords, payrollDetailRecords } from './seedData.js';
import { prisma } from "../src/config/db.js"

async function main() {

    console.log('Upserting Departments...');
    for (const dept of departmentRecords) {
        await prisma.department.upsert({
            where: { id: dept.id },
            update: { name: dept.name },
            create: dept,
        });
    }

    console.log('Upserting Employees...');
    for (const emp of employeeRecords) {
        await prisma.employee.upsert({
            where: { id: emp.id },
            update: {
                name: emp.name,
                basicSalary: emp.basicSalary,
                isActive: emp.isActive,
                departmentId: emp.departmentId,
            },
            create: emp,
        });
    }

    console.log('Upserting Attendance Records...');
    for (const att of attendanceRecords) {
        await prisma.attendance.upsert({
            // Uses the @@unique([employeeId, year, month]) composite index
            where: {
                employeeId_year_month: {
                    employeeId: att.employeeId,
                    year: att.year,
                    month: att.month,
                },
            },
            update: {
                totalWorkingDays: att.totalWorkingDays,
                daysPresent: att.daysPresent,
            },
            create: att,
        });
    }

    console.log('Upserting Payroll Runs...');
    for (const run of payrollRunRecords) {
        await prisma.payrollRun.upsert({
            where: { id: run.id },
            update: {
                month: run.month,
                year: run.year,
                runDate: run.runDate,
            },
            create: run,
        });
    }

    console.log('Upserting Payroll Details...');
    for (const det of payrollDetailRecords) {
        await prisma.payrollDetail.upsert({
            // Uses the @@unique([payrollRunId, employeeId]) composite index
            where: {
                payrollRunId_employeeId: {
                    payrollRunId: det.payrollRunId,
                    employeeId: det.employeeId,
                },
            },
            update: {
                basicSalary: det.basicSalary,
                workingDays: det.workingDays,
                daysPresent: det.daysPresent,
                grossPay: det.grossPay,
                pfDeduction: det.pfDeduction,
                professionalTax: det.professionalTax,
                netPay: det.netPay,
            },
            create: det,
        });
    }

    console.log('Syncing PostgreSQL ID sequences...');

    // Only list tables that have an auto-incrementing "id" column
    //   const tablesWithId = ['Department', 'Employee', 'PayrollRun', 'PayrollDetail']; 

    //   for (const tableName of tablesWithId) {
    //     // This query is safer: it checks if the sequence exists before trying to set it
    //     await prisma.$executeRawUnsafe(`
    //       DO $$
    //       BEGIN
    //         IF EXISTS (SELECT 1 FROM pg_class WHERE relname = '${tableName.toLowerCase()}_id_seq') THEN
    //           EXECUTE 'SELECT setval(pg_get_serial_sequence(''${tableName}'', ''id''), COALESCE(MAX(id), 0) + 1, false) FROM "${tableName}"';
    //         END IF;
    //       END $$;
    //     `);
    //   }

    const tables = [
        { name: 'Department', pk: 'id' },
        { name: 'Employee', pk: 'id' },
        { name: 'Attendance', pk: 'id' },
        { name: 'PayrollRun', pk: 'id' },
        { name: 'PayrollDetail', pk: 'payrollDetailId' } // Corrected Primary Key name
    ];

    for (const table of tables) {
        await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"${table.name}"', '${table.pk}'), 
        COALESCE((SELECT MAX("${table.pk}") FROM "${table.name}"), 0) + 1, 
        false
      );
    `);
    }


    console.log('Database successfully seeded via Upsert operations.');
}

main()
    .catch((e) => {
        console.error('❌ Seed script execution failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });