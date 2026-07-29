import { z } from 'zod';
import { Role } from '@prisma/client';

export const listAnnouncementsQuerySchema = z.object({
  query: z
    .object({
      category: z.enum(['Urgent', 'Academic', 'Transport', 'Wellness', 'Event']).optional(),
      search: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    })
    .partial(),
});

export const createAnnouncementSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(200),
      content: z.string().min(2).max(5000),
      category: z.enum(['Urgent', 'Academic', 'Transport', 'Wellness', 'Event']),
      targetRoles: z.array(z.nativeEnum(Role)).min(1),
      attachmentsCount: z.number().int().min(0).optional(),
    })
    .strict(),
});
