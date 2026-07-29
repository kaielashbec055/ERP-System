import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as parentService from '../services/parent.service';

export const getMyChildren = asyncHandler(async (req: Request, res: Response) => {
  const parentId = await parentService.resolveParentProfileId(req.user!.id);
  sendSuccess(res, await parentService.getChildren(parentId), 'Children fetched.');
});

export const linkChild = asyncHandler(async (req: Request, res: Response) => {
  const parentId = await parentService.resolveParentProfileId(req.user!.id);
  const link = await parentService.linkChildToParent(parentId, req.body.studentId, req.body.relation);
  sendCreated(res, link, 'Child linked to your account.');
});
