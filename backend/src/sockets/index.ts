import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { setIO } from './ioInstance';
import { registerChatHandlers } from './chat.socket';
import { registerBusHandlers } from './bus.socket';

interface AuthedSocket extends Socket {
  data: {
    userId: string;
    role: string;
  };
}

const allowedOrigins = [env.clientUrl, ...env.additionalCorsOrigins];

export function initializeSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // --- Auth handshake: every socket connection must present a valid access token ---
  io.use(async (socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (socket.handshake.headers.authorization?.toString().replace('Bearer ', '') as string | undefined);

      if (!token) return next(new Error('Authentication required'));

      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, isActive: true },
      });
      if (!user || !user.isActive) return next(new Error('Account not found or deactivated'));

      (socket as AuthedSocket).data.userId = user.id;
      (socket as AuthedSocket).data.role = user.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const s = socket as AuthedSocket;
    const userRoom = `user:${s.data.userId}`;
    socket.join(userRoom);
    logger.debug(`[socket] connected: user=${s.data.userId} role=${s.data.role} socket=${socket.id}`);

    // Broadcast presence so contacts can show an "online" indicator.
    io.emit('presence:online', { userId: s.data.userId });

    registerChatHandlers(io, s);
    registerBusHandlers(io, s);

    socket.on('disconnect', () => {
      logger.debug(`[socket] disconnected: user=${s.data.userId} socket=${socket.id}`);
      io.emit('presence:offline', { userId: s.data.userId });
    });
  });

  setIO(io);
  logger.info('✅ Socket.IO server initialized');
  return io;
}
