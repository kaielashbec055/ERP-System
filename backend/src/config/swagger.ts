import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'EduPulse ERP API',
    version: '1.0.0',
    description:
      'Production backend for the EduPulse ERP React frontend. Every endpoint responds with ' +
      '`{ success, message, data, errors }`. Authenticate with `Authorization: Bearer <accessToken>`.',
  },
  servers: [{ url: `${env.apiBaseUrl}/api/v1`, description: 'Current environment' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Students' },
    { name: 'Parents' },
    { name: 'Teachers' },
    { name: 'Academics' },
    { name: 'Wellness' },
    { name: 'Safety' },
    { name: 'Communication' },
    { name: 'AI' },
    { name: 'Fees' },
    { name: 'Admin' },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
});
