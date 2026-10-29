import { AppError } from '../utils/AppError.js';

const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Only the websites listed in ALLOWED_ORIGINS may call this API from a browser.
// Any other website gets a clear 403 (and does not use up our weather quota).
export function buildCorsOptions(allowedOrigins, { isProduction = false } = {}) {
  const allowed = new Set(allowedOrigins);
  if (!isProduction) DEV_ORIGINS.forEach((o) => allowed.add(o)); // local development convenience only

  return {
    origin(origin, callback) {
      // No Origin header = not a browser (health checks, curl). Browsers always send one.
      if (!origin) return callback(null, true);
      if (allowed.has(origin)) return callback(null, true);
      return callback(new AppError('ORIGIN_NOT_ALLOWED', 'This website is not allowed to use the API.', 403));
    },
    methods: ['GET'],
    maxAge: 600,
  };
}
