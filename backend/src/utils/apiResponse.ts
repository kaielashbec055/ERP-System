import { Response } from 'express';

/**
 * Every single endpoint in this API responds with this exact envelope:
 *   { success, message, data, errors }
 * This is a hard project-wide convention — do not deviate in new routes.
 */
export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown | null;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200,
): Response {
  const body: ApiResponseBody<T> = { success: true, message, data, errors: null };
  return res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T, message = 'Resource created'): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response, message = 'Deleted successfully'): Response {
  const body: ApiResponseBody<null> = { success: true, message, data: null, errors: null };
  return res.status(200).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors: unknown = null,
): Response {
  const body: ApiResponseBody<null> = { success: false, message, data: null, errors };
  return res.status(statusCode).json(body);
}
