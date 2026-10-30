import { AppError } from './AppError.js';

export const MAX_CITY_LENGTH = 100;
const CITY_PATTERN = /^[\p{L}\p{M}0-9 .,'’()-]+$/u;

export function validateCity(raw) {
  if (typeof raw !== 'string') {
    throw new AppError('INVALID_INPUT', 'Please provide a city name.', 400);
  }
  const city = raw.trim().replace(/\s+/g, ' ');
  if (!city) throw new AppError('INVALID_INPUT', 'Please provide a city name.', 400);
  if (city.length > MAX_CITY_LENGTH) {
    throw new AppError('INVALID_INPUT', 'City name is too long.', 400);
  }
  if (!CITY_PATTERN.test(city)) {
    throw new AppError('INVALID_INPUT', 'City name contains invalid characters.', 400);
  }
  return city;
}

export function validateCoordinates(rawLat, rawLon) {
  const lat = typeof rawLat === 'string' && rawLat.trim() !== '' ? Number(rawLat) : NaN;
  const lon = typeof rawLon === 'string' && rawLon.trim() !== '' ? Number(rawLon) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new AppError('INVALID_INPUT', 'Please provide valid coordinates.', 400);
  }
  return { lat, lon };
}

// Accepts either ?city=... or ?lat=...&lon=...
export function parseLocationQuery(query = {}) {
  if (query.city !== undefined) return { type: 'city', city: validateCity(query.city) };
  if (query.lat !== undefined || query.lon !== undefined) {
    return { type: 'coords', ...validateCoordinates(query.lat, query.lon) };
  }
  throw new AppError('INVALID_INPUT', 'Please provide a city or coordinates.', 400);
}

// ---- Contact form ----
export const CONTACT_TOPICS = ['Feedback', 'Question', 'Problem report', 'Other'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function text(value, label) {
  if (typeof value !== 'string') throw new AppError('INVALID_INPUT', `Please enter your ${label}.`, 400);
  return value;
}

export function validateContactMessage(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('INVALID_INPUT', 'Please fill in the form and try again.', 400);
  }

  // Hidden field only bots fill in. Pretend all is well and send nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') return { spam: true };

  const name = text(body.name, 'name').replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim();
  if (!name) throw new AppError('INVALID_INPUT', 'Please enter your name.', 400);
  if (name.length > 100) throw new AppError('INVALID_INPUT', 'Your name is too long.', 400);

  const email = text(body.email, 'email address').trim();
  if (email.length > 254 || !EMAIL_PATTERN.test(email) || email.replace(CONTROL_CHARS, '') !== email) {
    throw new AppError('INVALID_INPUT', 'Please enter a valid email address.', 400);
  }

  if (typeof body.topic !== 'string' || !CONTACT_TOPICS.includes(body.topic)) {
    throw new AppError('INVALID_INPUT', 'Please choose a topic.', 400);
  }

  const message = text(body.message, 'message').replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '').trim();
  if (message.length < 5) throw new AppError('INVALID_INPUT', 'Your message is too short.', 400);
  if (message.length > 4000) throw new AppError('INVALID_INPUT', 'Your message is too long (4000 characters at most).', 400);

  return { spam: false, name, email, topic: body.topic, message };
}
