import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { buildCorsOptions } from './config/cors.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createWeatherController } from './controllers/weatherController.js';
import { createWeatherRoutes } from './routes/weatherRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

function isSameSite(origin, host) {
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function createApp({ config, weatherService }) {
  const app = express();

  app.disable('x-powered-by');
  if (config.isProduction) app.set('trust proxy', 1); // hosting platforms sit behind a proxy

  app.use(helmet());
  // The website and the API live on the same address on Vercel, so requests from our own address are always fine.
  // Requests from any other website still need to be listed in ALLOWED_ORIGINS.
  const corsMiddleware = cors(buildCorsOptions(config.allowedOrigins, { isProduction: config.isProduction }));
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isSameSite(origin, req.headers.host)) return next();
    return corsMiddleware(req, res, next);
  });
  app.use(requestLogger);
  app.use('/api', createRateLimiter(config.rateLimit));

  app.use('/api/health', healthRoutes);
  app.use('/api/weather', (_req, res, next) => {
    // Lets the host's CDN reuse a good answer for 5 minutes. Errors override this with no-store.
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    next();
  });
  app.use('/api/weather', createRateLimiter(config.weatherRateLimit ?? config.rateLimit));
  app.use('/api/weather', createWeatherRoutes(createWeatherController(weatherService)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
