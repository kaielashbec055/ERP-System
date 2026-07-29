import { Server, Socket } from 'socket.io';

interface AuthedSocket extends Socket {
  data: { userId: string; role: string };
}

/**
 * Live GPS layer for BusTracker.tsx / ParentDashboard.tsx. Clients join a
 * `bus:{busId}` room and receive `bus:update` events whenever
 * bus.service.updateBusLiveStatus() or markStopPassed() runs (via REST from
 * a driver/admin client, or the optional simulator job in src/jobs).
 */
export function registerBusHandlers(_io: Server, socket: AuthedSocket): void {
  socket.on('bus:track', (busId: string) => {
    socket.join(`bus:${busId}`);
  });

  socket.on('bus:untrack', (busId: string) => {
    socket.leave(`bus:${busId}`);
  });
}
