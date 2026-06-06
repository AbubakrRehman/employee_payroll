import { prisma } from '../config/db.js';

export default class EmployeeRepository {
  /**
   * Fetch all employees along with their associated department details
   */
  static async findAll() {
    return await prisma.employee.findMany({
      include: {
        department: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}