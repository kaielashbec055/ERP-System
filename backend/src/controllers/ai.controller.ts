import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as aiService from '../services/ai.service';

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const result = await aiService.chat(req.user!.id, req.user!.role, req.body.prompt);
  sendSuccess(res, result, 'AI response generated.');
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.getChatHistory(req.user!.id), 'AI chat history fetched.');
});

export const studyPlan = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.studyPlan(req.user!.id), 'Study plan generated.');
});

export const homeworkHelp = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.homeworkHelp(req.body.subject, req.body.question), 'Homework help generated.');
});

export const performancePrediction = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.performancePrediction(req.user!.id), 'Performance prediction generated.');
});

export const wellnessAnalysis = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.wellnessAnalysis(req.user!.id), 'Wellness analysis generated.');
});

export const parentWeeklyReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await aiService.parentWeeklyReport(req.user!.id, req.params.studentId);
  sendSuccess(res, report, 'Parent weekly report generated.');
});

export const studentProgressSummary = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await aiService.studentProgressSummary(req.user!.id), 'Student progress summary generated.');
});
