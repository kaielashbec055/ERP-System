import { Server, Socket } from 'socket.io';
import { prisma } from '../config/prisma';

interface AuthedSocket extends Socket {
  data: { userId: string; role: string };
}

/**
 * Real-time layer for the ChatModule.tsx messaging UI. Actual message
 * persistence happens over REST (POST /communication/chat/conversations/:id/messages)
 * so messages survive refresh and are consistently validated server-side;
 * these socket events cover the ephemeral, low-latency UX on top:
 * typing indicators and read receipts.
 */
export function registerChatHandlers(io: Server, socket: AuthedSocket): void {
  socket.on('chat:join', async (conversationId: string) => {
    const isParticipant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: socket.data.userId } },
    });
    if (isParticipant) {
      socket.join(`conversation:${conversationId}`);
    }
  });

  socket.on('chat:leave', (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('chat:typing', ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
    socket.to(`conversation:${conversationId}`).emit('chat:typing', {
      conversationId,
      userId: socket.data.userId,
      isTyping,
    });
  });

  socket.on('chat:read', async ({ conversationId }: { conversationId: string }) => {
    await prisma.conversationParticipant
      .update({
        where: { conversationId_userId: { conversationId, userId: socket.data.userId } },
        data: { lastReadAt: new Date() },
      })
      .catch(() => undefined);

    socket.to(`conversation:${conversationId}`).emit('chat:read', {
      conversationId,
      userId: socket.data.userId,
      readAt: new Date().toISOString(),
    });
  });
}
