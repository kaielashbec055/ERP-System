import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as academicService from '../services/academic.service';
import { resolveTeacherProfileId } from '../services/teacher.service';

export const listClasses = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await academicService.listClasses(), 'Classes fetched.');
});

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  sendCreated(res, await academicService.createClass(req.body), 'Class created.');
});

export const listSubjects = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await academicService.listSubjects(), 'Subjects fetched.');
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  sendCreated(res, await academicService.createSubject(req.body.name), 'Subject created.');
});

export const assignSubjectTeacher = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await academicService.assignSubjectTeacher(req.body), 'Subject-teacher assignment saved.');
});

export const enrollStudent = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await academicService.enrollStudent(req.body), 'Student enrolled in class.');
});

export const upsertSubjectGrade = asyncHandler(async (req: Request, res: Response) => {
  const teacherId =
    req.user!.role === Role.TEACHER ? await resolveTeacherProfileId(req.user!.id) : undefined;
  sendSuccess(
    res,
    await academicService.upsertSubjectGrade({ ...req.body, teacherId }),
    'Grade recorded.',
  );
});
