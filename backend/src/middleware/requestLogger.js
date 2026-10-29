import { logger } from '../utils/logger.js';

// Logs method, path, status and time only. No query string (it can contain a location).
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
}
