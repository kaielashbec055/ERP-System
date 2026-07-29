import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { updateBusLiveStatus, markStopPassed } from '../services/bus.service';

const TICK_MS = 8000;

/**
 * Demo-only job: nudges every seeded bus a little closer to its next
 * unpassed stop every tick, so BusTracker.tsx / the parent dashboard have
 * live movement to display without needing a real driver app connected.
 * Enable via ENABLE_BUS_SIMULATOR=true. Safe to leave disabled — nothing
 * else in the system depends on it.
 */
export function startBusSimulator(): NodeJS.Timeout {
  logger.info('🚌 Bus GPS simulator started (demo mode)');

  return setInterval(async () => {
    try {
      const buses = await prisma.bus.findMany({ include: { stops: { orderBy: { order: 'asc' } } } });

      for (const bus of buses) {
        const nextStop = bus.stops.find((s) => !s.passed);
        if (!nextStop) continue;

        const dx = nextStop.coordX - bus.currentPosX;
        const dy = nextStop.coordY - bus.currentPosY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
          await markStopPassed(bus.id, nextStop.id, true);
          continue;
        }

        const step = 12;
        const ratio = step / distance;
        await updateBusLiveStatus(bus.id, {
          currentPosX: bus.currentPosX + dx * ratio,
          currentPosY: bus.currentPosY + dy * ratio,
          currentSpeed: 30 + Math.round(Math.random() * 15),
          etaMinutes: Math.max(1, Math.round(distance / 20)),
        });
      }
    } catch (err) {
      logger.error('[bus-simulator] tick failed', err);
    }
  }, TICK_MS);
}
