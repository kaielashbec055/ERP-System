import { z } from 'zod';

export const createGatePassSchema = z.object({
  body: z
    .object({
      studentId: z.string().uuid(),
      reason: z.string().min(2).max(300),
      date: z.string().min(1),
      timeOut: z.string().min(1),
      pickupPerson: z.string().min(2).max(150),
    })
    .strict(),
});

export const updateGatePassStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.enum(['approved', 'pending', 'used', 'expired']) }).strict(),
});

export const broadcastEmergencyAlertSchema = z.object({
  body: z
    .object({
      type: z.enum(['lockdown', 'weather', 'medical', 'fire', 'general']),
      title: z.string().min(2).max(200),
      message: z.string().min(2).max(2000),
      severity: z.enum(['critical', 'warning', 'info']).default('warning'),
    })
    .strict(),
});

export const resolveEmergencyAlertSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
