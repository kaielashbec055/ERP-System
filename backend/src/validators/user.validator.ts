import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120).optional(),
      avatarUrl: z.string().url().optional(),
      phone: z.string().max(30).optional(),
    })
    .strict(),
});

export const listUsersQuerySchema = z.object({
  query: z
    .object({
      page: z.string().optional(),
      limit: z.string().optional(),
      role: z.nativeEnum(Role).optional(),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    })
    .partial(),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid user id') }),
});

export const setActiveStatusSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid user id') }),
  body: z.object({ isActive: z.boolean() }).strict(),
});
