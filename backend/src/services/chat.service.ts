import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { getIO } from '../sockets/ioInstance';
import { createNotification } from './notification.service';

function chatRoleFor(role: Role): 'user' | 'teacher' | 'parent' {
  if (role === Role.TEACHER) return 'teacher';
  if (role === Role.PARENT) return 'parent';
  return 'user'; // STUDENT / ADMIN fall back to the generic frontend-supported value
}

function messageToDTO(m: {
  id: string;
  senderId: string;
  text: string;
  attachmentUrl: string | null;
  createdAt: Date;
  sender: { name: string; avatarUrl: string; role: Role };
}) {
  return {
    id: m.id,
    senderId: m.senderId,
    senderName: m.sender.name,
    senderAvatar: m.sender.avatarUrl,
    role: chatRoleFor(m.sender.role),
    text: m.text,
    timestamp: m.createdAt.toLocaleString('en-US'),
    attachmentUrl: m.attachmentUrl ?? undefined,
  };
}

export async function listMyConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: { include: { user: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  return conversations
    .map((c) => {
      const other = c.participants.find((p) => p.userId !== userId)?.user;
      const me = c.participants.find((p) => p.userId === userId);
      const lastMessage = c.messages[0];
      return {
        conversationId: c.id,
        contact: other
          ? {
              id: other.id,
              name: other.name,
              role: other.role.toLowerCase(),
              avatar: other.avatarUrl,
            }
          : null,
        lastMessage: lastMessage
          ? { text: lastMessage.text, timestamp: lastMessage.createdAt.toISOString() }
          : null,
        lastMessageAt: lastMessage?.createdAt ?? new Date(0),
        unread:
          !!lastMessage &&
          lastMessage.senderId !== userId &&
          (!me?.lastReadAt || lastMessage.createdAt > me.lastReadAt),
      };
    })
    .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
    .map(({ lastMessageAt, ...rest }) => rest);
}

export async function getOrCreateConversation(userId: string, otherUserId: string) {
  if (userId === otherUserId) throw AppError.badRequest('Cannot start a conversation with yourself.');

  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
  if (!otherUser) throw AppError.notFound('The other participant does not exist.');

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: otherUserId } } },
      ],
    },
  });
  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participants: { create: [{ userId }, { userId: otherUserId }] },
    },
  });
}

async function assertParticipant(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw AppError.forbidden('You are not part of this conversation.');
  return participant;
}

export async function listMessages(conversationId: string, userId: string) {
  await assertParticipant(conversationId, userId);

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });

  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });

  return messages.map(messageToDTO);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
  attachmentUrl?: string,
) {
  await assertParticipant(conversationId, senderId);

  const message = await prisma.message.create({
    data: { conversationId, senderId, text, attachmentUrl },
    include: { sender: true },
  });

  const dto = messageToDTO(message);

  const recipients = await prisma.conversationParticipant.findMany({
    where: { conversationId, userId: { not: senderId } },
  });

  for (const r of recipients) {
    getIO()?.to(`user:${r.userId}`).emit('chat:message', { conversationId, message: dto });
    await createNotification(r.userId, {
      title: `New message from ${dto.senderName}`,
      message: text.slice(0, 140),
      type: 'message',
    });
  }

  return dto;
}

/**
 * Role-appropriate contact suggestions for starting a new conversation —
 * mirrors the `contacts` list in the frontend's ChatModule.tsx, but derived
 * from real relationships instead of being hardcoded.
 */
export async function listContacts(userId: string, role: Role) {
  if (role === Role.PARENT) {
    const parent = await prisma.parentProfile.findUnique({
      where: { userId },
      include: { children: { include: { student: { include: { class: true } } } } },
    });
    const classIds = [
      ...new Set(parent?.children.map((c) => c.student.classId).filter(Boolean)),
    ] as string[];

    const [teachers, admins] = await Promise.all([
      prisma.teacherProfile.findMany({
        where: {
          OR: [
            { classesTaught: { some: { id: { in: classIds } } } },
            { classSubjects: { some: { classId: { in: classIds } } } },
          ],
        },
        include: { user: true },
      }),
      prisma.user.findMany({ where: { role: Role.ADMIN }, take: 5 }),
    ]);

    return [
      ...teachers.map((t) => ({
        id: t.user.id,
        name: t.user.name,
        role: 'teacher',
        avatar: t.user.avatarUrl,
        title: t.title,
      })),
      ...admins.map((a) => ({
        id: a.id,
        name: a.name,
        role: 'admin',
        avatar: a.avatarUrl,
        title: 'School Principal',
      })),
    ];
  }

  if (role === Role.TEACHER) {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { userId },
      include: {
        classesTaught: {
          include: { students: { include: { parentLinks: { include: { parent: { include: { user: true } } } } } } },
        },
      },
    });
    const parentUsers = new Map<string, { id: string; name: string; avatarUrl: string }>();
    teacher?.classesTaught.forEach((c) =>
      c.students.forEach((s) =>
        s.parentLinks.forEach((pl) => parentUsers.set(pl.parent.user.id, pl.parent.user)),
      ),
    );
    const admins = await prisma.user.findMany({ where: { role: Role.ADMIN }, take: 5 });

    return [
      ...[...parentUsers.values()].map((p) => ({
        id: p.id,
        name: p.name,
        role: 'parent',
        avatar: p.avatarUrl,
        title: 'Parent',
      })),
      ...admins.map((a) => ({
        id: a.id,
        name: a.name,
        role: 'admin',
        avatar: a.avatarUrl,
        title: 'School Principal',
      })),
    ];
  }

  if (role === Role.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { class: true },
    });
    const teachers = student?.classId
      ? await prisma.teacherProfile.findMany({
          where: {
            OR: [
              { classesTaught: { some: { id: student.classId } } },
              { classSubjects: { some: { classId: student.classId } } },
            ],
          },
          include: { user: true },
        })
      : [];
    return teachers.map((t) => ({
      id: t.user.id,
      name: t.user.name,
      role: 'teacher',
      avatar: t.user.avatarUrl,
      title: t.title,
    }));
  }

  // ADMIN: every teacher (broad oversight contact list)
  const teachers = await prisma.teacherProfile.findMany({ include: { user: true }, take: 50 });
  return teachers.map((t) => ({
    id: t.user.id,
    name: t.user.name,
    role: 'teacher',
    avatar: t.user.avatarUrl,
    title: t.title,
  }));
}
