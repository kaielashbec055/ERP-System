import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as gatePassService from '../services/gatepass.service';
import { prisma } from '../config/prisma';

export const listGatePasses = asyncHandler(async (req: Request, res: Response) => {
  let studentIds: string[] | undefined;

  if (req.user!.role === Role.PARENT) {
    const parent = await prisma.parentProfile.findUnique({
      where: { userId: req.user!.id },
      include: { children: true },
    });
    studentIds = parent?.children.map((c) => c.studentId) ?? [];
  } else if (req.user!.role === Role.STUDENT) {
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } });
    studentIds = student ? [student.id] : [];
  }

  sendSuccess(res, await gatePassService.listGatePasses({ studentIds }), 'Gate passes fetched.');
});

export const createGatePass = asyncHandler(async (req: Request, res: Response) => {
  const pass = await gatePassService.createGatePass(req.user!.id, req.body);
  sendCreated(res, pass, 'Digital QR gate pass generated.');
});

export const updateGatePassStatus = asyncHandler(async (req: Request, res: Response) => {
  const pass = await gatePassService.updateGatePassStatus(req.params.id, req.body.status);
  sendSuccess(res, pass, 'Gate pass status updated.');
});
