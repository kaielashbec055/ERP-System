import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as studentService from '../services/student.service';

async function currentStudentProfileId(req: Request): Promise<string> {
  return studentService.resolveStudentProfileId(req.user!.id);
}

export const getMySubjects = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentStudentProfileId(req);
  sendSuccess(res, await studentService.getSubjectGrades(id), 'Subject performance fetched.');
});

export const getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentStudentProfileId(req);
  sendSuccess(res, await studentService.getAssignmentsForStudent(id), 'Assignments fetched.');
});

export const submitMyAssignment = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentStudentProfileId(req);
  const submission = await studentService.submitAssignment(
    id,
    req.params.assignmentId,
    req.body?.fileUrl,
  );
  sendSuccess(res, submission, 'Assignment submitted successfully.');
});

export const getMyBadges = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentStudentProfileId(req);
  sendSuccess(res, await studentService.getBadges(id), 'Badges fetched.');
});

export const getMyDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const id = await currentStudentProfileId(req);
  sendSuccess(res, await studentService.getDashboardSummary(id), 'Dashboard summary fetched.');
});
