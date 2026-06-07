import { prisma } from '../config/db.js';

export default class EmployeeRepository {
  /**
   * Fetch all employees along with their associated department details
   */
  static async findAll() {
    return await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        basicSalary: true,
        isActive: true,
        department: {
          select: {
            id: true,
            name: true // Only return the department name, not the whole object
          }
        }
      }
    });
  }
}