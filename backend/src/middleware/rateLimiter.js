import rateLimit from 'express-rate-limit';

export function createRateLimiter({ windowMs, limit }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment.' } });
    },
  });
}
