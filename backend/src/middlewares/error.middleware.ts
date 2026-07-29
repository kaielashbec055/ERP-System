import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      return AppError.conflict(`A record with this ${target} already exists.`);
    }
    case 'P2025':
      return AppError.notFound('The requested record does not exist.');
    case 'P2003':
      return AppError.badRequest('This operation violates a foreign key relationship.');
    default:
      return AppError.badRequest(`Database error (${err.code}).`);
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = mapPrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    appError = AppError.badRequest('Invalid data sent to the database.');
  } else if (err instanceof Error) {
    appError = new AppError(env.isProduction ? 'Something went wrong.' : err.message, 500);
  } else {
    appError = AppError.internal();
  }

  if (appError.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${appError.message}`, {
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> [${appError.statusCode}] ${appError.message}`);
  }

  sendError(res, appError.message, appError.statusCode, appError.errors);
};
