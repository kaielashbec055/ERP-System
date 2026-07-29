import { GatePassStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

function statusToLower(s: GatePassStatus): 'approved' | 'pending' | 'used' | 'expired' {
  return s.toLowerCase() as any;
}

function toDTO(pass: {
  id: string;
  reason: string;
  date: string;
  timeOut: string;
  status: GatePassStatus;
  qrCodeUrl: string | null;
  pickupPerson: string;
  studentId: string;
  student: { user: { name: string } };
  requestedBy: { name: string };
}) {
  return {
    id: pass.id,
    studentName: pass.student.user.name,
    studentId: pass.studentId,
    parentName: pass.requestedBy.name,
    reason: pass.reason,
    date: pass.date,
    timeOut: pass.timeOut,
    status: statusToLower(pass.status),
    qrCodeUrl: pass.qrCodeUrl ?? undefined,
    pickupPerson: pass.pickupPerson,
  };
}

function generateQrCodeUrl(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  const data = `GP-EDUPULSE-2026-${code}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
}

export interface GatePassScope {
  studentIds?: string[]; // restrict to these StudentProfile ids (parent view)
}

export async function listGatePasses(scope: GatePassScope) {
  const passes = await prisma.digitalGatePass.findMany({
    where: scope.studentIds ? { studentId: { in: scope.studentIds } } : {},
    include: { student: { include: { user: true } }, requestedBy: true },
    orderBy: { createdAt: 'desc' },
  });
  return passes.map(toDTO);
}

export async function createGatePass(
  requestedByUserId: string,
  input: { studentId: string; reason: string; date: string; timeOut: string; pickupPerson: string },
) {
  const student = await prisma.studentProfile.findUnique({ where: { id: input.studentId } });
  if (!student) throw AppError.notFound('Student not found.');

  const pass = await prisma.digitalGatePass.create({
    data: {
      studentId: input.studentId,
      requestedByUserId,
      reason: input.reason,
      date: input.date,
      timeOut: input.timeOut,
      pickupPerson: input.pickupPerson,
      status: GatePassStatus.APPROVED, // auto-approved, matching the current frontend UX
      qrCodeUrl: generateQrCodeUrl(),
    },
    include: { student: { include: { user: true } }, requestedBy: true },
  });

  return toDTO(pass);
}

export async function updateGatePassStatus(id: string, status: 'approved' | 'pending' | 'used' | 'expired') {
  const pass = await prisma.digitalGatePass.update({
    where: { id },
    data: { status: status.toUpperCase() as GatePassStatus },
    include: { student: { include: { user: true } }, requestedBy: true },
  });
  return toDTO(pass);
}
