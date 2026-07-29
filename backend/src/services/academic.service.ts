import { Trend } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function listClasses() {
  return prisma.schoolClass.findMany({
    include: {
      classTeacher: { include: { user: true } },
      _count: { select: { students: true } },
    },
    orderBy: [{ grade: 'asc' }, { section: 'asc' }],
  });
}

export async function createClass(input: { grade: string; section: string; classTeacherId?: string }) {
  const existing = await prisma.schoolClass.findFirst({
    where: { grade: input.grade, section: input.section },
  });
  if (existing) throw AppError.conflict(`Class ${input.grade}-${input.section} already exists.`);

  return prisma.schoolClass.create({ data: input });
}

export async function listSubjects() {
  return prisma.subject.findMany({ orderBy: { name: 'asc' } });
}

export async function createSubject(name: string) {
  const existing = await prisma.subject.findUnique({ where: { name } });
  if (existing) throw AppError.conflict('This subject already exists.');
  return prisma.subject.create({ data: { name } });
}

export async function assignSubjectTeacher(input: {
  classId: string;
  subjectId: string;
  teacherId?: string;
}) {
  return prisma.classSubject.upsert({
    where: { classId_subjectId: { classId: input.classId, subjectId: input.subjectId } },
    update: { teacherId: input.teacherId },
    create: input,
  });
}

export async function enrollStudent(input: { studentId: string; classId: string; rollNumber?: string }) {
  const klass = await prisma.schoolClass.findUnique({ where: { id: input.classId } });
  if (!klass) throw AppError.notFound('Class not found.');

  return prisma.studentProfile.update({
    where: { id: input.studentId },
    data: { classId: input.classId, rollNumber: input.rollNumber },
  });
}

export async function upsertSubjectGrade(input: {
  studentId: string;
  subjectId: string;
  score: number;
  grade: string;
  lastTestScore: number;
  trend?: 'up' | 'down' | 'stable';
  teacherId?: string;
}) {
  const trend = (input.trend?.toUpperCase() as Trend) ?? Trend.STABLE;

  return prisma.subjectGrade.upsert({
    where: { studentId_subjectId: { studentId: input.studentId, subjectId: input.subjectId } },
    update: {
      score: input.score,
      grade: input.grade,
      lastTestScore: input.lastTestScore,
      trend,
      teacherId: input.teacherId,
    },
    create: {
      studentId: input.studentId,
      subjectId: input.subjectId,
      score: input.score,
      grade: input.grade,
      lastTestScore: input.lastTestScore,
      trend,
      teacherId: input.teacherId,
    },
  });
}
