import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as teacherService from '../services/teacher.service';

async function currentTeacherProfileId(req: Request): Promise<string> {
  return teacherService.resolveTeacherProfileId(req.user!.id);
}

export const getMyClasses = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  sendSuccess(res, await teacherService.getMyClasses(id), 'Classes fetched.');
});

export const getClassRoster = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  sendSuccess(res, await teacherService.getClassRoster(id, req.params.classId), 'Roster fetched.');
});

export const getClassMetrics = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  sendSuccess(res, await teacherService.getClassMetrics(id, req.params.classId), 'Class metrics fetched.');
});

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  const result = await teacherService.markAttendance(
    id,
    req.params.classId,
    req.body.date,
    req.body.records,
  );
  sendSuccess(res, result, 'Attendance saved and synced with Parent Portal.');
});

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  const assignment = await teacherService.createAssignment(id, req.body);
  sendCreated(res, assignment, 'Assignment published to class.');
});

export const listMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  const classId = req.query.classId as string | undefined;
  sendSuccess(res, await teacherService.listMyAssignments(id, classId), 'Assignments fetched.');
});

export const gradeSubmission = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentTeacherProfileId(req);
  const submission = await teacherService.gradeSubmission(id, req.params.submissionId, req.body.score);
  sendSuccess(res, submission, 'Submission graded.');
});
