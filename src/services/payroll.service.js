import PayrollRepository from "../repositories/payroll.repository.js";
import NotFoundError from "../utils/NotFoundError.js";

class PayrollService {
  
  static async fetchPayslip(runId, employeeId) {
    const payslip = await PayrollRepository.getPayslip(runId, employeeId);

    if (!payslip)
      throw new NotFoundError('Payslip not found for this employee in the specified run')

    return payslip;
  }

  static async fetchPayroll(month, year) {
    const payroll = await PayrollRepository.getPayrollRun(month, year);

    if (!payroll)
      throw new NotFoundError('Payroll run not found for the specified period');

    return payroll;
  }

  static async processPayroll(month, year) {
    try {
      const runId = await PayrollRepository.executePayrollRun(month, year);
      return { success: true, runId };
    } catch (error) {
      // Check for the custom PostgreSQL error code we set (P0001)
      if (error.message === 'DUPLICATE_PAYROLL_RUN') {
        throw new AppError(409, 'Payroll already exists')
      }
      throw error;
    }
  }
}

export default PayrollService