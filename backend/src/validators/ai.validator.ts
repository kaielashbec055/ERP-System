import { z } from 'zod';

export const aiChatSchema = z.object({
  body: z.object({ prompt: z.string().min(1).max(2000) }).strict(),
});

export const homeworkHelpSchema = z.object({
  body: z
    .object({
      subject: z.string().min(1).max(100),
      question: z.string().min(1).max(2000),
    })
    .strict(),
});

export const parentWeeklyReportSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});
