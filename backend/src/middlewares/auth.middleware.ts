import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/prisma';

/**
 * Verifies the Bearer access token, then attaches a trimmed-down user
 * object to `req.user`. We re-check `isActive` against the DB so a
 * deactivated account is locked out immediately, even mid-token-lifetime.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or malformed Authorization header');
    }

    const token = header.slice('Bearer '.length);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw AppError.unauthorized('Account not found or has been deactivated');
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(AppError.unauthorized('Invalid or expired access token'));
  }
};

/** Attaches req.user if a valid token is present, but never rejects the request. */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next();

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length));
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true, isActive: true },
    });
    if (user?.isActive) {
      req.user = { id: user.id, role: user.role, email: user.email };
    }
  } catch {
    // ignore invalid token in optional mode
  }
  next();
};
