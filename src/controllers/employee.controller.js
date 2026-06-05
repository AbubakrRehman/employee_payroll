// const UserService = require('../services/user.service');
import EmployeeService from "../services/employee.service.js";

class EmployeeController {
  static async getEmployees(req, res, next) {
      const employees = await EmployeeService.getEmployees();
      return res.status(200).json({ success: true, data: employees });
  }
}

// module.exports = new EmployeeController();
export default EmployeeController