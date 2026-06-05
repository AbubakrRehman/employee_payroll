import PayrollService from "../services/payroll.service.js";

class PayrollController {
  static async getPayrollByPeriod(req, res, next) {
      const payroll = await PayrollService.getPayrollForPeriod();
      return res.status(200).json({ success: true, data: payroll });
  }


  static async getEmployeePayslip(req, res, next) {
      const employeeSlip = await PayrollService.getEmployeePaySlip();
      return res.status(200).json({ success: true, data: employeeSlip });
  }

  static async runPayroll(req, res, next) {
      const payrollRun = await PayrollService.runPayroll();
      return res.status(200).json({ success: true, data: payrollRun });
  }
}

// module.exports = new EmployeeController();
export default PayrollController