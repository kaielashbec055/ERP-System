import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as adminService from '../services/admin.service';

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await adminService.getDashboardStats(), 'Dashboard stats fetched.');
});

export const getRecentActivity = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await adminService.getRecentActivity(), 'Recent activity fetched.');
});
