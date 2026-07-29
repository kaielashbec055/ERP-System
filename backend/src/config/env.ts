import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    // Fail fast and loud rather than limping along with undefined secrets.
    // eslint-disable-next-line no-console
    console.error(`[env] Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: optional('NODE_ENV', 'development') === 'production',
  port: Number(optional('PORT', '5000')),
  apiBaseUrl: optional('API_BASE_URL', 'http://localhost:5000'),
  clientUrl: optional('CLIENT_URL', 'http://localhost:5173'),
  additionalCorsOrigins: optional('ADDITIONAL_CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/edupulse'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret_change_me_min_32_characters'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me_min_32_characters'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '30d'),
  },

  bcryptSaltRounds: Number(optional('BCRYPT_SALT_ROUNDS', '12')),

  cloudinary: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME'),
    apiKey: optional('CLOUDINARY_API_KEY'),
    apiSecret: optional('CLOUDINARY_API_SECRET'),
    get isConfigured() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },

  smtp: {
    host: optional('SMTP_HOST'),
    port: Number(optional('SMTP_PORT', '587')),
    secure: optional('SMTP_SECURE', 'false') === 'true',
    user: optional('SMTP_USER'),
    password: optional('SMTP_PASSWORD'),
    fromName: optional('SMTP_FROM_NAME', 'EduPulse ERP'),
    fromEmail: optional('SMTP_FROM_EMAIL', 'no-reply@edupulse.edu'),
    get isConfigured() {
      return Boolean(this.host && this.user && this.password);
    },
  },

  rateLimit: {
    windowMs: Number(optional('RATE_LIMIT_WINDOW_MS', '900000')),
    max: Number(optional('RATE_LIMIT_MAX', '300')),
  },

  ai: {
    openaiApiKey: optional('OPENAI_API_KEY'),
    anthropicApiKey: optional('ANTHROPIC_API_KEY'),
  },

  enableBusSimulator: optional('ENABLE_BUS_SIMULATOR', 'false') === 'true',
};
