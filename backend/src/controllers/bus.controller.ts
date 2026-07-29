import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import * as busService from '../services/bus.service';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/prisma';

export const getBus = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await busService.getBusTracking(req.params.busId), 'Bus tracking data fetched.');
});

export const listBuses = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await busService.listBuses(), 'Buses fetched.');
});

export const createBus = asyncHandler(async (req: Request, res: Response) => {
  sendCreated(res, await busService.createBus(req.body), 'Bus route created.');
});

export const updateBusLiveStatus = asyncHandler(async (req: Request, res: Response) => {
  const bus = await busService.updateBusLiveStatus(req.params.busId, req.body);
  sendSuccess(res, bus, 'Bus live status updated & broadcast to trackers.');
});

export const markStopPassed = asyncHandler(async (req: Request, res: Response) => {
  const stop = await busService.markStopPassed(req.params.busId, req.params.stopId, req.body.passed);
  sendSuccess(res, stop, 'Stop status updated.');
});

/** For a parent: resolves + returns the live bus info for a given child (StudentProfile id). */
export const getBusForChild = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (req.user!.role === 'PARENT') {
    const link = await prisma.parentStudent.findFirst({
      where: { studentId, parent: { userId: req.user!.id } },
    });
    if (!link) throw AppError.forbidden('This student is not linked to your parent account.');
  }

  sendSuccess(res, await busService.getBusForStudent(studentId), 'Bus tracking data fetched.');
});
