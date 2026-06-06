import PayrollService from "../services/payroll.service.js";
import ApiResponse from "../utils/ApiResponse.js";

class PayrollController {
    static async getPayrollByPeriod(req, res, next) {
        const payroll = await PayrollService.getPayrollForPeriod();
        return ApiResponse.send(res, 200, payroll);
    }


    static async getEmployeePayslip(req, res, next) {
        const employeeSlip = await PayrollService.getEmployeePaySlip();
        return ApiResponse.send(res, 200, employeeSlip);
    }

    static async runPayroll(req, res, next) {
        const payrollRun = await PayrollService.runPayroll();
        return ApiResponse.send(res, 201, payrollRun);
    }
}

// module.exports = new EmployeeController();
export default PayrollController