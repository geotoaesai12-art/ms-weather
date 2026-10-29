// Vercel entry point: the same Express app as backend/, running as one serverless function.
import { config } from '../backend/src/config/env.js';
import { createApp } from '../backend/src/app.js';
import { createWeatherService } from '../backend/src/services/weatherService.js';
import { TTLCache } from '../backend/src/utils/cache.js';
import { logger } from '../backend/src/utils/logger.js';

if (!config.openWeatherApiKey) {
  logger.warn('OPENWEATHER_API_KEY is not set. Add it in Vercel > Settings > Environment Variables.');
}

const weatherService = createWeatherService({
  apiKey: config.openWeatherApiKey,
  timeoutMs: config.requestTimeoutMs,
  cache: new TTLCache(),
});

export default createApp({ config, weatherService });
