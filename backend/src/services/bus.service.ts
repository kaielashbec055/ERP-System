import { BusStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { getIO } from '../sockets/ioInstance';

function statusToLower(s: BusStatus): 'on_time' | 'delayed' | 'stopped' {
  return s.toLowerCase() as any;
}

/** Matches frontend `BusTrackingInfo` exactly. */
export async function getBusTracking(busId: string) {
  const bus = await prisma.bus.findUnique({
    where: { id: busId },
    include: { stops: { orderBy: { order: 'asc' } } },
  });
  if (!bus) throw AppError.notFound('Bus not found.');

  return {
    busId: bus.id,
    busNumber: bus.busNumber,
    driverName: bus.driverName,
    driverPhone: bus.driverPhone,
    routeNumber: bus.routeNumber,
    routeName: bus.routeName,
    currentSpeed: bus.currentSpeed,
    speedLimit: bus.speedLimit,
    status: statusToLower(bus.status),
    etaMinutes: bus.etaMinutes,
    stops: bus.stops.map((s) => ({
      id: s.id,
      name: s.name,
      time: s.time,
      passed: s.passed,
      coords: { x: s.coordX, y: s.coordY },
    })),
    currentBusPos: { x: bus.currentPosX, y: bus.currentPosY },
    passengerCount: bus.passengerCount,
    maxCapacity: bus.maxCapacity,
  };
}

export async function listBuses() {
  const buses = await prisma.bus.findMany({ include: { _count: { select: { students: true } } } });
  return buses.map((b) => ({
    id: b.id,
    busNumber: b.busNumber,
    routeNumber: b.routeNumber,
    routeName: b.routeName,
    status: statusToLower(b.status),
    ridersAssigned: b._count.students,
  }));
}

export async function createBus(input: {
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeNumber: string;
  routeName: string;
  speedLimit?: number;
  maxCapacity?: number;
  stops?: { name: string; time: string; order: number; coordX: number; coordY: number }[];
}) {
  return prisma.bus.create({
    data: {
      busNumber: input.busNumber,
      driverName: input.driverName,
      driverPhone: input.driverPhone,
      routeNumber: input.routeNumber,
      routeName: input.routeName,
      speedLimit: input.speedLimit ?? 45,
      maxCapacity: input.maxCapacity ?? 40,
      stops: input.stops ? { create: input.stops } : undefined,
    },
    include: { stops: true },
  });
}

interface LiveStatusUpdate {
  currentSpeed?: number;
  status?: 'on_time' | 'delayed' | 'stopped';
  etaMinutes?: number;
  passengerCount?: number;
  currentPosX?: number;
  currentPosY?: number;
}

/** Persists a live telemetry update and broadcasts it over Socket.IO to the `bus:{busId}` room. */
export async function updateBusLiveStatus(busId: string, update: LiveStatusUpdate) {
  const bus = await prisma.bus.update({
    where: { id: busId },
    data: {
      ...(update.currentSpeed !== undefined ? { currentSpeed: update.currentSpeed } : {}),
      ...(update.status ? { status: update.status.toUpperCase() as BusStatus } : {}),
      ...(update.etaMinutes !== undefined ? { etaMinutes: update.etaMinutes } : {}),
      ...(update.passengerCount !== undefined ? { passengerCount: update.passengerCount } : {}),
      ...(update.currentPosX !== undefined ? { currentPosX: update.currentPosX } : {}),
      ...(update.currentPosY !== undefined ? { currentPosY: update.currentPosY } : {}),
    },
  });

  const dto = await getBusTracking(busId);
  getIO()?.to(`bus:${busId}`).emit('bus:update', dto);
  return bus;
}

export async function markStopPassed(busId: string, stopId: string, passed: boolean) {
  const stop = await prisma.busStop.update({ where: { id: stopId }, data: { passed } });
  const dto = await getBusTracking(busId);
  getIO()?.to(`bus:${busId}`).emit('bus:update', dto);
  return stop;
}

/** Resolves the bus assigned to a specific student — used by the parent dashboard's tracking card. */
export async function getBusForStudent(studentProfileId: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    select: { busId: true },
  });
  if (!student?.busId) throw AppError.notFound('This student is not assigned to a bus route.');
  return getBusTracking(student.busId);
}
