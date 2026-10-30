import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(_req, res) {
  res.set('Cache-Control', 'no-store');
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
}

// Every error ends here. Visitors only ever see a code and a friendly message, never stack traces.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  res.set('Cache-Control', 'no-store'); // never let a CDN keep an error
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  // Body-parser problems (broken JSON, body too large) are the visitor's mistake, not ours.
  if (Number.isInteger(err?.status) && err.status >= 400 && err.status < 500 && err.expose) {
    const message = err.status === 413 ? 'Your message is too large.' : 'Please check the form and try again.';
    return res.status(err.status).json({ error: { code: 'INVALID_INPUT', message } });
  }
  logger.error('unhandled error', { name: err?.name, message: err?.message });
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong.' } });
}
