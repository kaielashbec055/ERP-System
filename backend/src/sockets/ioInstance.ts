import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export function setIO(io: Server): void {
  ioInstance = io;
}

/** Returns the live Socket.IO server, or null if sockets haven't been initialized (e.g. in tests). */
export function getIO(): Server | null {
  return ioInstance;
}
