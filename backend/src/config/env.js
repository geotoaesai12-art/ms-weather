import 'dotenv/config';

function parseOrigins(value) {
  return String(value ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  mongodbUri: process.env.MONGODB_URI || '', // used from Phase 5
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  requestTimeoutMs: 8000,
  rateLimit: { windowMs: 60 * 1000, limit: 60 }, // all /api routes
  weatherRateLimit: { windowMs: 60 * 1000, limit: 30 }, // /api/weather only (protects the OpenWeather quota)
});
