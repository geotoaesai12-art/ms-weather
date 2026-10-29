import { AppError } from '../utils/AppError.js';
import { normalizeCurrent, normalizeForecast } from '../utils/normalize.js';

const CURRENT_TTL_MS = 10 * 60 * 1000;
const FORECAST_TTL_MS = 30 * 60 * 1000;

function cacheKey(kind, location) {
  if (location.type === 'city') return `${kind}:city:${location.city.toLowerCase()}`;
  return `${kind}:geo:${location.lat.toFixed(2)}:${location.lon.toFixed(2)}`;
}

// All OpenWeather-specific logic lives here (routes and controllers know nothing about the provider).
export function createWeatherService({ apiKey, baseUrl = 'https://api.openweathermap.org/data/2.5', timeoutMs = 8000, cache, fetchImpl = fetch, now = () => Date.now() }) {
  async function callProvider(path, location) {
    if (!apiKey) {
      throw new AppError('PROVIDER_AUTH', 'Weather service is not configured.', 503);
    }

    const url = new URL(`${baseUrl}${path}`);
    if (location.type === 'city') {
      url.searchParams.set('q', location.city);
    } else {
      url.searchParams.set('lat', String(location.lat));
      url.searchParams.set('lon', String(location.lon));
    }
    url.searchParams.set('units', 'metric');
    url.searchParams.set('appid', apiKey);

    let response;
    try {
      response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), headers: { Accept: 'application/json' } });
    } catch (err) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        throw new AppError('UPSTREAM_TIMEOUT', 'The weather service took too long to respond.', 504);
      }
      throw new AppError('UPSTREAM_ERROR', 'Could not reach the weather service.', 502);
    }

    // Never include `url` in errors or logs: it contains the API key.
    if (response.status === 401) throw new AppError('PROVIDER_AUTH', 'Weather service rejected our credentials.', 503);
    if (response.status === 404) throw new AppError('CITY_NOT_FOUND', 'City not found.', 404);
    if (response.status === 429) throw new AppError('RATE_LIMITED', 'Weather service is busy. Try again soon.', 429);
    if (!response.ok) throw new AppError('UPSTREAM_ERROR', 'The weather service had a problem.', 502);

    try {
      return await response.json();
    } catch {
      throw new AppError('UPSTREAM_ERROR', 'The weather service returned unreadable data.', 502);
    }
  }

  async function getCached(kind, path, normalize, ttlMs, location) {
    const key = cacheKey(kind, location);
    const hit = cache?.get(key);
    if (hit) return { data: hit.value, meta: { cached: true, fetchedAt: Math.floor(hit.storedAt / 1000) } };

    const data = normalize(await callProvider(path, location));
    const fetchedAt = now();
    cache?.set(key, data, ttlMs);
    return { data, meta: { cached: false, fetchedAt: Math.floor(fetchedAt / 1000) } };
  }

  return {
    getCurrent: (location) => getCached('current', '/weather', normalizeCurrent, CURRENT_TTL_MS, location),
    getForecast: (location) => getCached('forecast', '/forecast', normalizeForecast, FORECAST_TTL_MS, location),
  };
}
