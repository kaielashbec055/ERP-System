import { EmergencyStatus, EmergencyType, NotificationType, Role, Severity } from '@prisma/client';
import { prisma } from '../config/prisma';
import { getIO } from '../sockets/ioInstance';

function toDTO(alert: {
  id: string;
  type: EmergencyType;
  title: string;
  message: string;
  status: EmergencyStatus;
  severity: Severity;
  createdAt: Date;
  issuedBy: { name: string };
}) {
  return {
    id: alert.id,
    type: alert.type.toLowerCase() as 'lockdown' | 'weather' | 'medical' | 'fire' | 'general',
    title: alert.title,
    message: alert.message,
    issuedBy: alert.issuedBy.name,
    timestamp: alert.createdAt.toLocaleString('en-US'),
    status: alert.status.toLowerCase() as 'active' | 'resolved',
    severity: alert.severity.toLowerCase() as 'critical' | 'warning' | 'info',
  };
}

export async function listEmergencyAlerts() {
  const alerts = await prisma.emergencyAlert.findMany({
    include: { issuedBy: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return alerts.map(toDTO);
}

interface CreateAlertInput {
  type: 'lockdown' | 'weather' | 'medical' | 'fire' | 'general';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

/**
 * Creates + broadcasts a campus-wide emergency alert. Every active user
 * connected to Socket.IO receives it instantly; a Notification row is also
 * persisted for every Student/Parent/Teacher so it survives page reloads.
 */
export async function broadcastEmergencyAlert(issuedByUserId: string, input: CreateAlertInput) {
  const alert = await prisma.emergencyAlert.create({
    data: {
      type: input.type.toUpperCase() as EmergencyType,
      title: input.title,
      message: input.message,
      severity: input.severity.toUpperCase() as Severity,
      status: EmergencyStatus.ACTIVE,
      issuedByUserId,
    },
    include: { issuedBy: true },
  });

  const dto = toDTO(alert);

  // Fan-out a persisted notification to every non-admin user so it shows in
  // their notification bell even if they were offline when it fired.
  const recipients = await prisma.user.findMany({
    where: { role: { in: [Role.STUDENT, Role.PARENT, Role.TEACHER] }, isActive: true },
    select: { id: true },
  });
  if (recipients.length) {
    await prisma.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        title: `EMERGENCY ALERT: ${input.title}`,
        message: input.message,
        type: NotificationType.ALERT,
      })),
    });
  }

  getIO()?.emit('emergency:alert', dto);
  for (const r of recipients) {
    getIO()?.to(`user:${r.id}`).emit('notification:new', {
      title: `EMERGENCY ALERT: ${input.title}`,
      message: input.message,
      type: 'alert',
    });
  }

  return dto;
}

export async function resolveEmergencyAlert(id: string) {
  const alert = await prisma.emergencyAlert.update({
    where: { id },
    data: { status: EmergencyStatus.RESOLVED },
    include: { issuedBy: true },
  });
  const dto = toDTO(alert);
  getIO()?.emit('emergency:resolved', dto);
  return dto;
}
