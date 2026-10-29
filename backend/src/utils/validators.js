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
