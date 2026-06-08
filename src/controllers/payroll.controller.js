import AttendanceService from "../services/attendance.service.js";
import PayrollService from "../services/payroll.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import NotFoundError from "../utils/NotFoundError.js";

class PayrollController {
    static async getPayroll(req, res) {
        const month = parseInt(req.params.month);
        const year = parseInt(req.params.year);
        const payroll = await PayrollService.fetchPayroll(month, year);
        return ApiResponse.send(res, 200, payroll);
    }

    static async getEmployeePayslip(req, res) {
        const runId = parseInt(req.params.runId);
        const employeeId = parseInt(req.params.employeeId);
        const payslip = await PayrollService.fetchPayslip(runId, employeeId);
        return ApiResponse.send(res, 200, payslip);
    }

    static async runPayroll(req, res, next) {
        const { year, month } = req.body;
        const attendanceCount = await AttendanceService.getAttendanceCount(year, month);
        if (attendanceCount === 0) {
            throw new NotFoundError(`Cannot process payroll: No attendance records found for ${month}/${year}.`)
        }
        const payrollRun = await PayrollService.processPayroll(month, year);
        return ApiResponse.send(res, 201, payrollRun);
    }
}

// module.exports = new EmployeeController();
export default PayrollController