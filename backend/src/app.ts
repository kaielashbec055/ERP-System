import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rateLimit.middleware';
import { sendSuccess } from './utils/apiResponse';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  // --- Security & parsing middleware -----------------------------------------
  app.use(helmet());
  app.use(
    cors({
      origin: [env.clientUrl, ...env.additionalCorsOrigins],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // --- Logging ------------------------------------------------------------------
  app.use(
    morgan(env.isProduction ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    }),
  );

  app.use('/api/v1', apiLimiter);

  // --- Health check ----------------------------------------------------------------
  app.get('/health', (_req, res) => {
    sendSuccess(res, { uptime: process.uptime(), timestamp: new Date().toISOString() }, 'EduPulse API is healthy.');
  });

  // --- API docs ------------------------------------------------------------------
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'EduPulse API Docs' }));
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

  // --- API routes ------------------------------------------------------------------
  app.use('/api/v1', apiRoutes);

  // --- 404 + error handling ------------------------------------------------------------
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
