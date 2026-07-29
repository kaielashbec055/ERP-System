import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { comparePassword, hashPassword } from '../utils/hash';
import {
  hashToken,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { v4 as uuid } from 'uuid';
import { toUserProfile, UserProfileDTO } from './user.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: UserProfileDTO;
  tokens: AuthTokens;
}

const DEFAULT_AVATARS: Record<Role, string> = {
  STUDENT: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  PARENT: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  TEACHER: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  ADMIN: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
};

async function issueTokens(userId: string, role: Role, email: string): Promise<AuthTokens> {
  const accessToken = signAccessToken({ sub: userId, role, email });

  const tokenId = uuid();
  const refreshToken = signRefreshToken({ sub: userId, tokenId });

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (existing) {
    throw AppError.conflict('An account with this email already exists.');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
        role: input.role,
        avatarUrl: DEFAULT_AVATARS[input.role],
      },
    });

    if (input.role === Role.STUDENT) {
      let classId: string | undefined;
      if (input.grade && input.section) {
        const existingClass = await tx.schoolClass.findFirst({
          where: { grade: input.grade, section: input.section },
        });
        const klass =
          existingClass ??
          (await tx.schoolClass.create({ data: { grade: input.grade, section: input.section } }));
        classId = klass.id;
      }
      await tx.studentProfile.create({
        data: { userId: created.id, classId },
      });
    } else if (input.role === Role.PARENT) {
      await tx.parentProfile.create({ data: { userId: created.id } });
    } else if (input.role === Role.TEACHER) {
      await tx.teacherProfile.create({
        data: {
          userId: created.id,
          title: 'Teacher',
          subjectSpecialty: input.subjectSpecialty ?? '',
        },
      });
    }
    // ADMIN needs no extra profile row.

    return created;
  });

  const tokens = await issueTokens(user.id, user.role, user.email);
  const profile = await toUserProfile(user.id);
  return { user: profile, tokens };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !user.isActive) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  const tokens = await issueTokens(user.id, user.role, user.email);
  const profile = await toUserProfile(user.id);
  return { user: profile, tokens };
}

export async function refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token.');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { id: payload.tokenId } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw AppError.unauthorized('Refresh token has been revoked or expired.');
  }
  if (stored.tokenHash !== hashToken(rawRefreshToken)) {
    throw AppError.unauthorized('Refresh token mismatch.');
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || !user.isActive) {
    throw AppError.unauthorized('Account not found or deactivated.');
  }

  // Rotate: revoke the old refresh token, issue a fresh pair.
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  return issueTokens(user.id, user.role, user.email);
}

export async function logoutUser(rawRefreshToken?: string): Promise<void> {
  if (!rawRefreshToken) return;
  try {
    const payload = verifyRefreshToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { id: payload.tokenId },
      data: { revoked: true },
    });
  } catch {
    // token already invalid/expired — nothing to revoke, treat logout as successful
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) throw AppError.badRequest('Current password is incorrect.');

  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    // Force re-login everywhere else for security.
    prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true } }),
  ]);
}
