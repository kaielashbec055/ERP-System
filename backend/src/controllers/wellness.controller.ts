import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as wellnessService from '../services/wellness.service';
import { resolveStudentProfileId } from '../services/student.service';

export const addMyMoodEntry = asyncHandler(async (req: Request, res: Response) => {
  const studentId = await resolveStudentProfileId(req.user!.id);
  const entry = await wellnessService.addMoodEntry(studentId, req.body);
  sendCreated(res, entry, "Wellness check-in saved & analyzed by AI guidance engine.");
});

export const getMyMoodEntries = asyncHandler(async (req: Request, res: Response) => {
  const studentId = await resolveStudentProfileId(req.user!.id);
  sendSuccess(res, await wellnessService.getMoodEntries(studentId), 'Mood entries fetched.');
});

export const listRiskAlerts = asyncHandler(async (req: Request, res: Response) => {
  const { classId, severity, resolved } = req.query as Record<string, string | undefined>;
  const alerts = await wellnessService.listRiskAlerts({
    classId,
    severity: severity as 'high' | 'medium' | undefined,
    resolved: resolved ? resolved === 'true' : undefined,
  });
  sendSuccess(res, alerts, 'Risk alerts fetched.');
});

export const resolveRiskAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await wellnessService.resolveRiskAlert(req.params.id);
  sendSuccess(res, alert, 'Risk alert marked as resolved.');
});

export const generateRiskAlerts = asyncHandler(async (req: Request, res: Response) => {
  const classId = req.body?.classId as string | undefined;
  const result = await wellnessService.generateRiskAlerts(classId);
  sendSuccess(res, result, 'AI Early Warning scan complete.');
});
