import { AttendanceStatus, BusStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardStats() {
  const todayStart = startOfToday();
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const [totalStudents, totalStaff, totalBuses, onTimeBuses, todayRecords, presentToday, activeGatePasses] =
    await Promise.all([
      prisma.studentProfile.count(),
      prisma.teacherProfile.count(),
      prisma.bus.count(),
      prisma.bus.count({ where: { status: BusStatus.ON_TIME } }),
      prisma.attendanceRecord.count({ where: { date: { gte: todayStart, lt: todayEnd } } }),
      prisma.attendanceRecord.count({
        where: {
          date: { gte: todayStart, lt: todayEnd },
          status: { in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE] },
        },
      }),
      prisma.digitalGatePass.count({ where: { status: 'APPROVED' } }),
    ]);

  return {
    totalEnrolled: totalStudents,
    totalStaff,
    activeBuses: totalBuses,
    onTimeBuses,
    todayAttendancePercent: todayRecords > 0 ? Number(((presentToday / todayRecords) * 100).toFixed(1)) : null,
    presentToday,
    totalAttendanceRecordsToday: todayRecords,
    activeGatePasses,
    systemSafety: 'optimal' as const,
  };
}

export async function getRecentActivity() {
  const [alerts, announcements] = await Promise.all([
    prisma.emergencyAlert.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { issuedBy: true } }),
    prisma.circularAnnouncement.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { author: true } }),
  ]);

  return {
    recentAlerts: alerts.map((a) => ({ id: a.id, title: a.title, createdAt: a.createdAt.toISOString() })),
    recentAnnouncements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      createdAt: a.createdAt.toISOString(),
    })),
  };
}
