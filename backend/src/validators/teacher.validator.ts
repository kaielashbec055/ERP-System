import { z } from 'zod';

export const classIdParamSchema = z.object({
  params: z.object({ classId: z.string().uuid() }),
});

export const markAttendanceSchema = z.object({
  params: z.object({ classId: z.string().uuid() }),
  body: z
    .object({
      date: z.string().min(1, 'date is required (YYYY-MM-DD)'),
      records: z
        .array(
          z.object({
            studentId: z.string().uuid(),
            status: z.enum(['present', 'absent', 'late']),
          }),
        )
        .min(1),
    })
    .strict(),
});

export const createAssignmentSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(200),
      subjectId: z.string().uuid(),
      classId: z.string().uuid(),
      dueDate: z.string().min(1),
      maxScore: z.number().positive().optional(),
      priority: z.enum(['high', 'medium', 'low']).optional(),
      description: z.string().max(2000).optional(),
    })
    .strict(),
});

export const gradeSubmissionSchema = z.object({
  params: z.object({ submissionId: z.string().uuid() }),
  body: z.object({ score: z.number().min(0) }).strict(),
});
