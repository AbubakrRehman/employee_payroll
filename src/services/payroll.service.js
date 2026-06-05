// const UserRepository = require('../repositories/user.repository');

class PayrollService {
  static async getEmployeePaySlip(runId, employeeId) {
    // const user = await UserRepository.findById(id);
    // if (!user) {
    //   throw new Error('User not found'); 
    // }
    // return user;

    return "this is getEmployeePaySlip rersponse"
  }

  static async getPayrollForPeriod(month, year) {
    // const user = await UserRepository.findById(id);
    // if (!user) {
    //   throw new Error('User not found'); 
    // }
    // return user;

    return "this is getPayrollForPeriod rersponse"
  }

   static async runPayroll() {
    // const user = await UserRepository.findById(id);
    // if (!user) {
    //   throw new Error('User not found'); 
    // }
    // return user;

    return "this is payroll run rersponse"
  }
}

// module.exports = new EmployeeService();
export default PayrollService