import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as authService from '../services/auth.service';
import { toUserProfile } from '../services/user.service';
import { env } from '../config/env';

const REFRESH_COOKIE_NAME = 'edupulse_refresh_token';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendCreated(res, result, 'Account created successfully.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendSuccess(res, result, 'Signed in successfully.');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.body.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
  if (!raw) {
    return sendSuccess(res, null, 'No refresh token supplied.', 400);
  }
  const tokens = await authService.refreshTokens(raw);
  setRefreshCookie(res, tokens.refreshToken);
  sendSuccess(res, tokens, 'Tokens refreshed.');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.body.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logoutUser(raw);
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
  sendSuccess(res, null, 'Signed out successfully.');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const profile = await toUserProfile(req.user!.id);
  sendSuccess(res, profile, 'Current user fetched.');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  sendSuccess(res, null, 'Password changed successfully. Please sign in again.');
});
