import { AnnouncementCategory, NotificationType, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { buildPaginatedMeta, PaginationParams } from '../utils/pagination';
import { getIO } from '../sockets/ioInstance';

function toDTO(a: {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  createdAt: Date;
  targetRoles: Role[];
  attachmentsCount: number;
  author: { name: string };
}) {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    category: a.category as 'Urgent' | 'Academic' | 'Transport' | 'Wellness' | 'Event',
    date: a.createdAt.toISOString().split('T')[0],
    author: a.author.name,
    targetRoles: a.targetRoles.map((r) => r.toLowerCase()) as (
      | 'student'
      | 'parent'
      | 'teacher'
      | 'admin'
    )[],
    attachmentsCount: a.attachmentsCount,
  };
}

export interface AnnouncementFilters {
  category?: string;
  search?: string;
  forRole?: Role;
}

export async function listAnnouncements(filters: AnnouncementFilters, pagination: PaginationParams) {
  const where = {
    ...(filters.category ? { category: filters.category.toUpperCase() as AnnouncementCategory } : {}),
    ...(filters.forRole ? { targetRoles: { has: filters.forRole } } : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' as const } },
            { content: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [items, totalItems] = await prisma.$transaction([
    prisma.circularAnnouncement.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.limit,
    }),
    prisma.circularAnnouncement.count({ where }),
  ]);

  return { items: items.map(toDTO), meta: buildPaginatedMeta(totalItems, pagination) };
}

export async function createAnnouncement(
  authorUserId: string,
  input: {
    title: string;
    content: string;
    category: 'Urgent' | 'Academic' | 'Transport' | 'Wellness' | 'Event';
    targetRoles: Role[];
    attachmentsCount?: number;
  },
) {
  const announcement = await prisma.circularAnnouncement.create({
    data: {
      title: input.title,
      content: input.content,
      category: input.category.toUpperCase() as AnnouncementCategory,
      targetRoles: input.targetRoles,
      attachmentsCount: input.attachmentsCount ?? 0,
      authorUserId,
    },
    include: { author: true },
  });

  const dto = toDTO(announcement);

  const recipients = await prisma.user.findMany({
    where: { role: { in: input.targetRoles }, isActive: true },
    select: { id: true },
  });
  if (recipients.length) {
    await prisma.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        title: `New Circular: ${input.title}`,
        message: input.content.slice(0, 140),
        type: NotificationType.ACADEMIC,
      })),
    });
    for (const r of recipients) {
      getIO()?.to(`user:${r.id}`).emit('notification:new', {
        title: `New Circular: ${input.title}`,
        message: input.content.slice(0, 140),
        type: 'academic',
      });
    }
  }

  getIO()?.emit('announcement:new', dto);
  return dto;
}
