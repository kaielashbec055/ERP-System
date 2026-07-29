import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as userService from '../services/user.service';
import { getPagination, buildPaginatedMeta, getSort } from '../utils/pagination';
import { uploadBufferToCloudinary } from '../config/cloudinary';
import { AppError } from '../utils/AppError';

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.updateOwnProfile(req.user!.id, req.body);
  sendSuccess(res, profile, 'Profile updated.');
});

export const uploadMyAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No file uploaded. Attach an image under field "avatar".');
  const { url } = await uploadBufferToCloudinary(req.file.buffer, 'avatars', req.user!.id);
  const profile = await userService.updateOwnProfile(req.user!.id, { avatarUrl: url });
  sendSuccess(res, profile, 'Avatar updated.');
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const orderBy = getSort(req, ['name', 'email', 'createdAt', 'role']);
  const { items, totalItems } = await userService.listUsers(
    { role: req.query.role as any, search: req.query.search as string | undefined },
    pagination.skip,
    pagination.limit,
    orderBy,
  );
  sendSuccess(res, { items, meta: buildPaginatedMeta(totalItems, pagination) }, 'Users fetched.');
});

export const setUserActiveStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.setUserActiveStatus(req.params.id, req.body.isActive);
  sendSuccess(res, { id: user.id, isActive: user.isActive }, 'User status updated.');
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.toUserProfile(req.params.id);
  sendSuccess(res, profile, 'User profile fetched.');
});
