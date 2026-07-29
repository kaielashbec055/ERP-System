import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

/** General API rate limiter — generous, protects against abuse/DoS. */
export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    data: null,
    errors: null,
  },
});

/** Strict limiter for auth endpoints (login/register) to slow brute-force attempts. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in a few minutes.',
    data: null,
    errors: null,
  },
});
