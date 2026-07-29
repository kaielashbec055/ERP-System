import { NotificationType } from '@prisma/client';
import { prisma } from '../config/prisma';
import { getIO } from '../sockets/ioInstance';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function toDTO(n: {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  type: NotificationType;
  actionUrl: string | null;
}) {
  return {
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: timeAgo(n.createdAt),
    read: n.read,
    type: n.type.toLowerCase() as 'alert' | 'academic' | 'transport' | 'wellness' | 'message',
    actionUrl: n.actionUrl ?? undefined,
  };
}

export async function listMyNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return notifications.map(toDTO);
}

export async function markNotificationRead(userId: string, id: string) {
  const notification = await prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
  return notification.count > 0;
}

export async function markAllNotificationsRead(userId: string) {
  const result = await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return result.count;
}

export async function createNotification(
  userId: string,
  input: { title: string; message: string; type: 'alert' | 'academic' | 'transport' | 'wellness' | 'message'; actionUrl?: string },
) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title: input.title,
      message: input.message,
      type: input.type.toUpperCase() as NotificationType,
      actionUrl: input.actionUrl,
    },
  });
  const dto = toDTO(notification);
  getIO()?.to(`user:${userId}`).emit('notification:new', dto);
  return dto;
}
