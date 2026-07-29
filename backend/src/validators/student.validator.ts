import { z } from 'zod';

export const submitAssignmentSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
  body: z
    .object({
      fileUrl: z.string().url().optional(),
    })
    .strict()
    .optional(),
});

export const studentIdParamSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});
