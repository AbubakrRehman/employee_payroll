import { prisma } from '../config/db.js';

export default class AttendanceRepository {
    static async calculateAttendanceCount(year, month) {
        const attendanceCount = await prisma.attendance.count({
            where: {
                month: parseInt(month),
                year: parseInt(year),
            },
        })

        return attendanceCount;
    }
}