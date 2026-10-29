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

export function createApp({ config, weatherService }) {
  const app = express();

  app.disable('x-powered-by');
  if (config.isProduction) app.set('trust proxy', 1); // hosting platforms sit behind a proxy

  app.use(helmet());
  app.use(cors(buildCorsOptions(config.allowedOrigins, { isProduction: config.isProduction })));
  app.use(requestLogger);
  app.use('/api', createRateLimiter(config.rateLimit));

  app.use('/api/health', healthRoutes);
  app.use('/api/weather', createRateLimiter(config.weatherRateLimit ?? config.rateLimit));
  app.use('/api/weather', createWeatherRoutes(createWeatherController(weatherService)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
