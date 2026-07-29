import { z } from 'zod';

export const createClassSchema = z.object({
  body: z
    .object({
      grade: z.string().min(1).max(40),
      section: z.string().min(1).max(10),
      classTeacherId: z.string().uuid().optional(),
    })
    .strict(),
});

export const createSubjectSchema = z.object({
  body: z.object({ name: z.string().min(1).max(100) }).strict(),
});

export const assignSubjectTeacherSchema = z.object({
  body: z
    .object({
      classId: z.string().uuid(),
      subjectId: z.string().uuid(),
      teacherId: z.string().uuid().optional(),
    })
    .strict(),
});

export const upsertSubjectGradeSchema = z.object({
  body: z
    .object({
      studentId: z.string().uuid(),
      subjectId: z.string().uuid(),
      score: z.number().min(0).max(100),
      grade: z.string().min(1).max(5),
      lastTestScore: z.number().min(0).max(100),
      trend: z.enum(['up', 'down', 'stable']).optional(),
    })
    .strict(),
});

export const enrollStudentSchema = z.object({
  body: z
    .object({
      studentId: z.string().uuid(),
      classId: z.string().uuid(),
      rollNumber: z.string().max(20).optional(),
    })
    .strict(),
});
