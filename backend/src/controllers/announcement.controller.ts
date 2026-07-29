import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as announcementService from '../services/announcement.service';
import { getPagination } from '../utils/pagination';

export const listAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const result = await announcementService.listAnnouncements(
    {
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      forRole: req.user!.role,
    },
    pagination,
  );
  sendSuccess(res, result, 'Announcements fetched.');
});

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const announcement = await announcementService.createAnnouncement(req.user!.id, req.body);
  sendCreated(res, announcement, 'Circular published.');
});
