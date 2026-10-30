import { config } from './config/env.js';
import { createApp } from './app.js';
import { createWeatherService } from './services/weatherService.js';
import { createMailService } from './services/mailService.js';
import { TTLCache } from './utils/cache.js';
import { logger } from './utils/logger.js';

if (!config.openWeatherApiKey) {
  logger.warn('OPENWEATHER_API_KEY is not set. Weather requests will fail until you add it to backend/.env');
}
if (config.isProduction && config.allowedOrigins.length === 0) {
  logger.warn('ALLOWED_ORIGINS is empty. Browsers will not be able to call this API.');
}

const weatherService = createWeatherService({
  apiKey: config.openWeatherApiKey,
  timeoutMs: config.requestTimeoutMs,
  cache: new TTLCache(),
});

const mailService = createMailService({
  apiKey: config.contact.resendApiKey,
  toEmail: config.contact.toEmail,
  fromEmail: config.contact.fromEmail,
  timeoutMs: config.requestTimeoutMs,
});
if (!mailService.isConfigured()) {
  logger.warn('RESEND_API_KEY / CONTACT_TO_EMAIL not set. The contact form will answer "unavailable" until you add them to backend/.env');
}

const app = createApp({ config, weatherService, mailService });
const server = app.listen(config.port, () => {
  logger.info('server started', { port: config.port, env: config.nodeEnv });
});

// Graceful shutdown: stop accepting requests, finish the running ones, then exit.
function shutdown(signal) {
  logger.info('shutting down', { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
