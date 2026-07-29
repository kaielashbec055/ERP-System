import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function resolveParentProfileId(userId: string): Promise<string> {
  const profile = await prisma.parentProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.notFound('Parent profile not found for this account.');
  return profile.id;
}

function busStatusToLower(s: string): 'on_route' | 'arrived' | 'delayed' | 'not_started' {
  return s.toLowerCase() as any;
}

function feeStatusToLower(s: string): 'paid' | 'pending' | 'overdue' {
  return s.toLowerCase() as any;
}

/** Matches frontend `ChildInfo[]` exactly. */
export async function getChildren(parentProfileId: string) {
  const links = await prisma.parentStudent.findMany({
    where: { parentId: parentProfileId },
    include: {
      student: {
        include: { user: true, class: true, bus: true },
      },
    },
  });

  return links.map(({ student }) => ({
    id: student.id,
    name: student.user.name,
    grade: student.class?.grade ?? 'Unassigned',
    section: student.class?.section ?? '-',
    avatar: student.user.avatarUrl,
    gpa: student.gpa,
    attendancePercent: student.attendancePercent,
    busRoute: student.bus ? `${student.bus.routeNumber} - ${student.bus.routeName}` : 'Not assigned',
    busStatus: busStatusToLower(student.busStatus),
    feeStatus: feeStatusToLower(student.feeStatus),
    pendingFeeAmount: student.pendingFeeAmount,
  }));
}

export async function linkChildToParent(parentProfileId: string, studentProfileId: string, relation = 'Parent') {
  const student = await prisma.studentProfile.findUnique({ where: { id: studentProfileId } });
  if (!student) throw AppError.notFound('Student not found.');

  return prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parentProfileId, studentId: studentProfileId } },
    update: { relation },
    create: { parentId: parentProfileId, studentId: studentProfileId, relation },
  });
}
