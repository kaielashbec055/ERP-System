import { z } from 'zod';

export const busIdParamSchema = z.object({
  params: z.object({ busId: z.string().uuid() }),
});

export const createBusSchema = z.object({
  body: z
    .object({
      busNumber: z.string().min(1).max(20),
      driverName: z.string().min(1).max(120),
      driverPhone: z.string().min(1).max(30),
      routeNumber: z.string().min(1).max(20),
      routeName: z.string().min(1).max(150),
      speedLimit: z.number().positive().optional(),
      maxCapacity: z.number().int().positive().optional(),
      stops: z
        .array(
          z.object({
            name: z.string().min(1),
            time: z.string().min(1),
            order: z.number().int(),
            coordX: z.number(),
            coordY: z.number(),
          }),
        )
        .optional(),
    })
    .strict(),
});

export const updateBusLiveStatusSchema = z.object({
  params: z.object({ busId: z.string().uuid() }),
  body: z
    .object({
      currentSpeed: z.number().min(0).optional(),
      status: z.enum(['on_time', 'delayed', 'stopped']).optional(),
      etaMinutes: z.number().int().min(0).optional(),
      passengerCount: z.number().int().min(0).optional(),
      currentPosX: z.number().optional(),
      currentPosY: z.number().optional(),
    })
    .strict(),
});

export const markStopPassedSchema = z.object({
  params: z.object({ busId: z.string().uuid(), stopId: z.string().uuid() }),
  body: z.object({ passed: z.boolean() }).strict(),
});
