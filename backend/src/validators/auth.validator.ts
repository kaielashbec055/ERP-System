import { z } from 'zod';
import { Role } from '@prisma/client';

const roleEnum = z.nativeEnum(Role);

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(120),
      email: z.string().email('A valid email is required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      role: roleEnum,
      // Optional role-specific onboarding fields
      grade: z.string().optional(), // used when role = STUDENT
      section: z.string().optional(), // used when role = STUDENT
      subjectSpecialty: z.string().optional(), // used when role = TEACHER
      schoolCode: z.string().optional(), // reserved for future multi-school onboarding
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email('A valid email is required'),
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
});

export const refreshSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(1).optional(),
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    })
    .strict(),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
