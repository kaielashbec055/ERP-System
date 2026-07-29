import { AssignmentStatus, AttendanceStatus, Priority } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function resolveTeacherProfileId(userId: string): Promise<string> {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.notFound('Teacher profile not found for this account.');
  return profile.id;
}

async function assertOwnsClass(teacherProfileId: string, classId: string) {
  const klass = await prisma.schoolClass.findUnique({
    where: { id: classId },
    include: { subjects: true },
  });
  if (!klass) throw AppError.notFound('Class not found.');

  const owns =
    klass.classTeacherId === teacherProfileId ||
    klass.subjects.some((s) => s.teacherId === teacherProfileId);

  if (!owns) throw AppError.forbidden('You do not teach this class.');
  return klass;
}

export async function getMyClasses(teacherProfileId: string) {
  const classes = await prisma.schoolClass.findMany({
    where: {
      OR: [{ classTeacherId: teacherProfileId }, { subjects: { some: { teacherId: teacherProfileId } } }],
    },
    include: { _count: { select: { students: true } } },
  });

  return classes.map((c) => ({
    id: c.id,
    grade: c.grade,
    section: c.section,
    label: `${c.grade} - Section ${c.section}`,
    enrolledCount: c._count.students,
    isClassTeacher: c.classTeacherId === teacherProfileId,
  }));
}

/** Matches the `studentsList` shape used by TeacherDashboard.tsx's attendance marker. */
export async function getClassRoster(teacherProfileId: string, classId: string) {
  await assertOwnsClass(teacherProfileId, classId);

  const students = await prisma.studentProfile.findMany({
    where: { classId },
    include: { user: true },
    orderBy: { rollNumber: 'asc' },
  });

  return students.map((s) => ({
    id: s.id,
    name: s.user.name,
    roll: s.rollNumber ?? '-',
    avatar: s.user.avatarUrl,
  }));
}

export async function getClassMetrics(teacherProfileId: string, classId: string) {
  await assertOwnsClass(teacherProfileId, classId);

  const [studentCount, gradeAgg, submissions, totalAssignments] = await Promise.all([
    prisma.studentProfile.count({ where: { classId } }),
    prisma.subjectGrade.aggregate({
      _avg: { score: true },
      where: { student: { classId } },
    }),
    prisma.assignmentSubmission.count({
      where: { assignment: { classId }, status: { not: AssignmentStatus.PENDING } },
    }),
    prisma.assignmentSubmission.count({ where: { assignment: { classId } } }),
  ]);

  return {
    totalEnrolled: studentCount,
    averageGrade: gradeAgg._avg.score ? Number(gradeAgg._avg.score.toFixed(1)) : 0,
    submissionRate: totalAssignments > 0 ? Number(((submissions / totalAssignments) * 100).toFixed(1)) : 0,
  };
}

interface AttendanceRecordInput {
  studentId: string; // StudentProfile.id
  status: 'present' | 'absent' | 'late';
}

export async function markAttendance(
  teacherProfileId: string,
  classId: string,
  date: string,
  records: AttendanceRecordInput[],
) {
  await assertOwnsClass(teacherProfileId, classId);
  const day = new Date(date);

  await prisma.$transaction(
    records.map((r) =>
      prisma.attendanceRecord.upsert({
        where: { studentId_date: { studentId: r.studentId, date: day } },
        update: { status: r.status.toUpperCase() as AttendanceStatus, markedByTeacherId: teacherProfileId },
        create: {
          studentId: r.studentId,
          classId,
          date: day,
          status: r.status.toUpperCase() as AttendanceStatus,
          markedByTeacherId: teacherProfileId,
        },
      }),
    ),
  );

  // Recompute each affected student's rolling attendance percentage.
  for (const r of records) {
    const [total, present] = await Promise.all([
      prisma.attendanceRecord.count({ where: { studentId: r.studentId } }),
      prisma.attendanceRecord.count({
        where: { studentId: r.studentId, status: { in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE] } },
      }),
    ]);
    const pct = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 100;
    await prisma.studentProfile.update({ where: { id: r.studentId }, data: { attendancePercent: pct } });
  }

  return { classId, date, recordsSaved: records.length };
}

interface CreateAssignmentInput {
  title: string;
  subjectId: string;
  classId: string;
  dueDate: string;
  maxScore?: number;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
}

export async function createAssignment(teacherProfileId: string, input: CreateAssignmentInput) {
  await assertOwnsClass(teacherProfileId, input.classId);

  const assignment = await prisma.assignment.create({
    data: {
      title: input.title,
      subjectId: input.subjectId,
      classId: input.classId,
      teacherId: teacherProfileId,
      dueDate: new Date(input.dueDate),
      maxScore: input.maxScore ?? 100,
      priority: (input.priority?.toUpperCase() as Priority) ?? Priority.MEDIUM,
      description: input.description ?? '',
    },
  });

  // Pre-create a PENDING submission row for every enrolled student so the
  // student dashboard can immediately show "3 Pending" without extra joins.
  const students = await prisma.studentProfile.findMany({
    where: { classId: input.classId },
    select: { id: true },
  });
  if (students.length) {
    await prisma.assignmentSubmission.createMany({
      data: students.map((s) => ({ assignmentId: assignment.id, studentId: s.id })),
      skipDuplicates: true,
    });
  }

  return assignment;
}

export async function listMyAssignments(teacherProfileId: string, classId?: string) {
  return prisma.assignment.findMany({
    where: { teacherId: teacherProfileId, ...(classId ? { classId } : {}) },
    include: { subject: true, class: true, _count: { select: { submissions: true } } },
    orderBy: { dueDate: 'desc' },
  });
}

export async function gradeSubmission(
  teacherProfileId: string,
  submissionId: string,
  score: number,
) {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true },
  });
  if (!submission) throw AppError.notFound('Submission not found.');
  if (submission.assignment.teacherId !== teacherProfileId) {
    throw AppError.forbidden('You did not create this assignment.');
  }

  return prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { score, status: AssignmentStatus.GRADED, gradedAt: new Date() },
  });
}
