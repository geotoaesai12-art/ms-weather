import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
}

// Every error ends here. Visitors only ever see a code and a friendly message, never stack traces.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  logger.error('unhandled error', { name: err?.name, message: err?.message });
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong.' } });
}
