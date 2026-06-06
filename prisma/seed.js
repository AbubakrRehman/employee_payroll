import { coreDepartments, mockEmployees } from './seedData.js';
import {prisma} from "../src/config/db.js"

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`🌱 Running seed script in [${process.env.NODE_ENV || 'development'}] mode...`);

  // 1. Seed Core Departments
  console.log('🏢 Upserting core departments...');
  for (const dept of coreDepartments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: { name: dept.name },
      create: { id: dept.id, name: dept.name },
    });
  }

  // 2. Production Guard
  if (isProduction) {
    console.log('⚠️ Production detected. Skipping mock operational records.');
    console.log('✅ Production seeding completed successfully.');
    return;
  }

  // 3. Seed Mock Employees
  console.log('👥 Seeding 25 mock employees...');
  for (const emp of mockEmployees) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      update: { name: emp.name, basicSalary: emp.basicSalary, departmentId: emp.departmentId },
      create: {
        id: emp.id,
        name: emp.name,
        basicSalary: emp.basicSalary,
        departmentId: emp.departmentId,
        isActive: true,
      },
    });
  }

  // 4. Seed Multi-Month Attendance Matrix
  console.log('📅 Seeding multi-month attendance matrix...');
  for (const emp of mockEmployees) {
    // Standard variations
    let mayDaysPresent = Math.floor(Math.random() * (21 - 17 + 1)) + 17;
    let juneDaysPresent = Math.floor(Math.random() * (22 - 18 + 1)) + 18;

    // Hard override rules for targeted absence testing (Employees 10 and 15)
    if (emp.id === 10 || emp.id === 15) {
      mayDaysPresent = 0;
      juneDaysPresent = 0;
    }

    // May 2026 Cycle
    await prisma.attendance.upsert({
      where: {
        employeeId_month_year: { employeeId: emp.id, month: 5, year: 2026 },
      },
      update: { totalWorkingDays: 21, daysPresent: mayDaysPresent },
      create: {
        employeeId: emp.id,
        month: 5,
        year: 2026,
        totalWorkingDays: 21,
        daysPresent: mayDaysPresent,
      },
    });

    // June 2026 Cycle
    await prisma.attendance.upsert({
      where: {
        employeeId_month_year: { employeeId: emp.id, month: 6, year: 2026 },
      },
      update: { totalWorkingDays: 22, daysPresent: juneDaysPresent },
      create: {
        employeeId: emp.id,
        month: 6,
        year: 2026,
        totalWorkingDays: 22,
        daysPresent: juneDaysPresent,
      },
    });
  }

  console.log('✅ Success! Core lookups and clean workforce data synchronized.');
}

main()
  .catch((e) => {
    console.error('❌ Seed script execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });