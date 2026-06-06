import  EmployeeRepository from "../repositories/employee.repository.js";

class EmployeeService {
  static async getEmployees() {
    // const user = await UserRepository.findById(id);
    // if (!user) {
    //   throw new Error('User not found'); 
    // }
    // return user;

    // return "this is employees list rersponse"
    return await EmployeeRepository.findAll();
  }
}

// module.exports = new EmployeeService();
export default EmployeeService