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
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  requestTimeoutMs: 8000,
  rateLimit: { windowMs: 60 * 1000, limit: 60 }, // all /api routes
  weatherRateLimit: { windowMs: 60 * 1000, limit: 30 }, // /api/weather only (protects the OpenWeather quota)
  contactRateLimit: { windowMs: 10 * 60 * 1000, limit: 5 }, // /api/contact only: 5 messages per 10 minutes per visitor
  contact: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    toEmail: (process.env.CONTACT_TO_EMAIL || '').trim(), // the inbox that receives messages
    fromEmail: (process.env.CONTACT_FROM || 'MS Weather <onboarding@resend.dev>').trim(),
  },
});
