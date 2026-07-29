import { Role } from '@prisma/client';

export const ROLES = {
  STUDENT: Role.STUDENT,
  PARENT: Role.PARENT,
  TEACHER: Role.TEACHER,
  ADMIN: Role.ADMIN,
} as const;

export const ALL_ROLES: Role[] = [Role.STUDENT, Role.PARENT, Role.TEACHER, Role.ADMIN];

export const STAFF_ROLES: Role[] = [Role.TEACHER, Role.ADMIN];
