/*
  Warnings:

  - You are about to alter the column `month` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `year` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `totalWorkingDays` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `daysPresent` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `workingDays` on the `PayrollDetail` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `daysPresent` on the `PayrollDetail` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `month` on the `PayrollRun` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `year` on the `PayrollRun` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - A unique constraint covering the columns `[employeeId,year,month]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year,month]` on the table `PayrollRun` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attendance_employeeId_month_year_key";

-- DropIndex
DROP INDEX "PayrollRun_month_year_key";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "month" SET DATA TYPE SMALLINT,
ALTER COLUMN "year" SET DATA TYPE SMALLINT,
ALTER COLUMN "totalWorkingDays" SET DATA TYPE SMALLINT,
ALTER COLUMN "daysPresent" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "PayrollDetail" ALTER COLUMN "workingDays" SET DATA TYPE SMALLINT,
ALTER COLUMN "daysPresent" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "PayrollRun" ALTER COLUMN "month" SET DATA TYPE SMALLINT,
ALTER COLUMN "year" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_employeeId_year_month_key" ON "Attendance"("employeeId", "year", "month");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollRun_year_month_key" ON "PayrollRun"("year", "month");
