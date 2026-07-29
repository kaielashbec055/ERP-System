import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/prisma';
import { initializeSocketServer } from './sockets';
import { startBusSimulator } from './jobs/busSimulator.job';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);

  initializeSocketServer(httpServer);

  let simulatorHandle: NodeJS.Timeout | undefined;
  if (env.enableBusSimulator) {
    simulatorHandle = startBusSimulator();
  }

  httpServer.listen(env.port, () => {
    logger.info(`🚀 EduPulse API listening on port ${env.port} [${env.nodeEnv}]`);
    logger.info(`📘 API docs available at ${env.apiBaseUrl}/api-docs`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} received — shutting down gracefully...`);
    if (simulatorHandle) clearInterval(simulatorHandle);
    httpServer.close(async () => {
      await disconnectDatabase();
      logger.info('✅ Shutdown complete.');
      process.exit(0);
    });
    // Force-exit if graceful shutdown hangs
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start EduPulse API:', err);
  process.exit(1);
});
