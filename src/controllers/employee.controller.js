// const UserService = require('../services/user.service');
import EmployeeService from "../services/employee.service.js";
import ApiResponse from "../utils/ApiResponse.js";

class EmployeeController {
  static async getEmployees(req, res, next) {
      const employees = await EmployeeService.getEmployees();
      // return res.status(200).json({ success: true, data: employees });
      return ApiResponse.send(res, 200, employees);
  }
}

// module.exports = new EmployeeController();
export default EmployeeController