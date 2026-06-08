import AttendanceRepository from "../repositories/attendance.repository.js"

class AttendanceService {
    static async getAttendanceCount(year, month) {
       return await AttendanceRepository.calculateAttendanceCount(year, month)
    }
}

// module.exports = new EmployeeService();
export default AttendanceService