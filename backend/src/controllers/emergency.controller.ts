import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as emergencyService from '../services/emergency.service';

export const listEmergencyAlerts = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await emergencyService.listEmergencyAlerts(), 'Emergency alerts fetched.');
});

export const broadcastEmergencyAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await emergencyService.broadcastEmergencyAlert(req.user!.id, req.body);
  sendCreated(res, alert, 'Emergency broadcast dispatched live to all parents & staff.');
});

export const resolveEmergencyAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await emergencyService.resolveEmergencyAlert(req.params.id);
  sendSuccess(res, alert, 'Emergency alert marked as resolved.');
});
