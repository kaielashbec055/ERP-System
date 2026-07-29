import { AssignmentStatus, Trend } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

/** Resolves the StudentProfile.id for a given User.id, or throws 403/404. */
export async function resolveStudentProfileId(userId: string): Promise<string> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.notFound('Student profile not found for this account.');
  return profile.id;
}

function trendToLower(t: Trend): 'up' | 'down' | 'stable' {
  return t.toLowerCase() as 'up' | 'down' | 'stable';
}

function statusToLower(s: AssignmentStatus): 'pending' | 'submitted' | 'graded' {
  return s.toLowerCase() as 'pending' | 'submitted' | 'graded';
}

/** Matches frontend `SubjectGrade[]` exactly. */
export async function getSubjectGrades(studentProfileId: string) {
  const rows = await prisma.subjectGrade.findMany({
    where: { studentId: studentProfileId },
    include: { subject: true, teacher: { include: { user: true } } },
    orderBy: { subject: { name: 'asc' } },
  });

  return rows.map((r) => ({
    subject: r.subject.name,
    score: r.score,
    grade: r.grade,
    teacher: r.teacher?.user.name ?? 'Unassigned',
    trend: trendToLower(r.trend),
    lastTestScore: r.lastTestScore,
  }));
}

/** Matches frontend `Assignment[]` exactly, scoped to the student's class + their own submission status. */
export async function getAssignmentsForStudent(studentProfileId: string) {
  const student = await prisma.studentProfile.findUniqueOrThrow({
    where: { id: studentProfileId },
    select: { classId: true },
  });
  if (!student.classId) return [];

  const assignments = await prisma.assignment.findMany({
    where: { classId: student.classId },
    include: {
      subject: true,
      submissions: { where: { studentId: studentProfileId } },
    },
    orderBy: { dueDate: 'asc' },
  });

  return assignments.map((a) => {
    const submission = a.submissions[0];
    return {
      id: a.id,
      title: a.title,
      subject: a.subject.name,
      dueDate: a.dueDate.toISOString().split('T')[0],
      status: statusToLower(submission?.status ?? AssignmentStatus.PENDING),
      score: submission?.score ?? undefined,
      maxScore: a.maxScore,
      priority: a.priority.toLowerCase() as 'high' | 'medium' | 'low',
    };
  });
}

export async function submitAssignment(
  studentProfileId: string,
  assignmentId: string,
  fileUrl?: string,
) {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw AppError.notFound('Assignment not found.');

  const student = await prisma.studentProfile.findUniqueOrThrow({
    where: { id: studentProfileId },
  });
  if (student.classId !== assignment.classId) {
    throw AppError.forbidden('This assignment is not assigned to your class.');
  }

  const submission = await prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: studentProfileId } },
    update: { status: AssignmentStatus.SUBMITTED, fileUrl, submittedAt: new Date() },
    create: {
      assignmentId,
      studentId: studentProfileId,
      status: AssignmentStatus.SUBMITTED,
      fileUrl,
      submittedAt: new Date(),
    },
  });

  return submission;
}

/** Matches frontend `AchievementBadge[]` exactly. */
export async function getBadges(studentProfileId: string) {
  const badges = await prisma.achievementBadge.findMany({
    where: { studentId: studentProfileId },
    orderBy: { dateEarned: 'desc' },
  });

  return badges.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    iconName: b.iconName,
    dateEarned: b.dateEarned.toISOString().split('T')[0],
    category: b.category.toLowerCase() as 'academic' | 'wellness' | 'attendance' | 'safety',
  }));
}

/** Powers the stat cards at the top of StudentDashboard.tsx. */
export async function getDashboardSummary(studentProfileId: string) {
  const [student, pendingCount, highPriorityPendingCount, badgeCount] = await Promise.all([
    prisma.studentProfile.findUniqueOrThrow({ where: { id: studentProfileId } }),
    prisma.assignmentSubmission.count({
      where: { studentId: studentProfileId, status: AssignmentStatus.PENDING },
    }),
    prisma.assignment.count({
      where: {
        priority: 'HIGH',
        class: { students: { some: { id: studentProfileId } } },
        submissions: { none: { studentId: studentProfileId, status: { not: AssignmentStatus.PENDING } } },
      },
    }),
    prisma.achievementBadge.count({ where: { studentId: studentProfileId } }),
  ]);

  return {
    gpa: student.gpa,
    attendancePercent: student.attendancePercent,
    pendingAssignments: pendingCount,
    highPriorityPending: highPriorityPendingCount,
    badgesEarned: badgeCount,
    xpPoints: student.xpPoints,
    streakDays: student.streakDays,
  };
}
