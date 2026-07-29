import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

/**
 * Mirrors the frontend's `UserProfile` interface exactly
 * (src/types/index.ts in the React app):
 *
 *   interface UserProfile {
 *     id: string; name: string; email: string; role: UserRole;
 *     avatar: string; title?: string; gradeOrSubject?: string;
 *   }
 */
export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  avatar: string;
  title?: string;
  gradeOrSubject?: string;
}

function roleToLower(role: Role): UserProfileDTO['role'] {
  return role.toLowerCase() as UserProfileDTO['role'];
}

/** Builds the exact UserProfile shape the frontend expects, deriving title/gradeOrSubject per role. */
export async function toUserProfile(userId: string): Promise<UserProfileDTO> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: { include: { class: true } },
      parentProfile: { include: { children: { include: { student: { include: { user: true } } } } } },
      teacherProfile: true,
    },
  });

  if (!user) throw AppError.notFound('User not found.');

  const base = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleToLower(user.role),
    avatar: user.avatarUrl,
  };

  if (user.role === Role.STUDENT && user.studentProfile) {
    const klass = user.studentProfile.class;
    return {
      ...base,
      title: 'Student',
      gradeOrSubject: klass ? `${klass.grade} - Section ${klass.section}` : 'Unassigned',
    };
  }

  if (user.role === Role.TEACHER && user.teacherProfile) {
    return {
      ...base,
      title: user.teacherProfile.title || 'Teacher',
      gradeOrSubject: user.teacherProfile.subjectSpecialty || 'General Studies',
    };
  }

  if (user.role === Role.PARENT && user.parentProfile) {
    const names = user.parentProfile.children.map((c) => c.student.user.name.split(' ')[0]);
    return {
      ...base,
      title: 'Parent',
      gradeOrSubject: names.length ? `Parent of ${names.join(' & ')}` : 'Parent',
    };
  }

  if (user.role === Role.ADMIN) {
    return {
      ...base,
      title: 'School Principal & Director',
      gradeOrSubject: 'Central Administration',
    };
  }

  return base;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found.');
  return user;
}

export async function updateOwnProfile(
  userId: string,
  updates: { name?: string; avatarUrl?: string; phone?: string },
): Promise<UserProfileDTO> {
  await prisma.user.update({ where: { id: userId }, data: updates });
  return toUserProfile(userId);
}

export interface ListUsersFilters {
  role?: Role;
  search?: string;
}

export async function listUsers(
  filters: ListUsersFilters,
  skip: number,
  take: number,
  orderBy: Record<string, 'asc' | 'desc'>,
) {
  const where = {
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' as const } },
            { email: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [items, totalItems] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, totalItems };
}

export async function setUserActiveStatus(userId: string, isActive: boolean) {
  return prisma.user.update({ where: { id: userId }, data: { isActive } });
}
