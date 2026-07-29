import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as feeService from '../services/fee.service';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/prisma';

async function assertParentOwnsChild(userId: string, studentId: string) {
  const link = await prisma.parentStudent.findFirst({ where: { studentId, parent: { userId } } });
  if (!link) throw AppError.forbidden('This student is not linked to your parent account.');
}

export const listInvoices = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role === Role.PARENT) {
    await assertParentOwnsChild(req.user!.id, req.params.studentId);
  }
  sendSuccess(res, await feeService.listInvoicesForStudent(req.params.studentId), 'Fee invoices fetched.');
});

export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  sendCreated(res, await feeService.createInvoice(req.body), 'Fee invoice created.');
});

export const payFees = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role === Role.PARENT) {
    await assertParentOwnsChild(req.user!.id, req.params.studentId);
  }
  const result = await feeService.payFees(req.user!.id, req.params.studentId, req.body.amount, req.body.method);
  sendSuccess(res, result, `Payment successful! Receipt sent to ${req.user!.email}.`);
});
