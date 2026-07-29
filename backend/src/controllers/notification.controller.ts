import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as notificationService from '../services/notification.service';
import { AppError } from '../utils/AppError';

export const listMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await notificationService.listMyNotifications(req.user!.id), 'Notifications fetched.');
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const ok = await notificationService.markNotificationRead(req.user!.id, req.params.id);
  if (!ok) throw AppError.notFound('Notification not found.');
  sendSuccess(res, { id: req.params.id, read: true }, 'Notification marked as read.');
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  const count = await notificationService.markAllNotificationsRead(req.user!.id);
  sendSuccess(res, { updated: count }, 'All notifications marked as read.');
});
