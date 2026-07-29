import { z } from 'zod';

export const addMoodEntrySchema = z.object({
  body: z
    .object({
      date: z.string().min(1),
      score: z.number().int().min(1).max(5),
      tags: z.array(z.string()).default([]),
      note: z.string().max(1000).optional(),
    })
    .strict(),
});

export const listRiskAlertsQuerySchema = z.object({
  query: z
    .object({
      classId: z.string().uuid().optional(),
      severity: z.enum(['high', 'medium']).optional(),
      resolved: z.enum(['true', 'false']).optional(),
    })
    .partial(),
});

export const resolveRiskAlertSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
