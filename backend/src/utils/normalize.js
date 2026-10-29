import { AppError } from './AppError.js';

function invalid() {
  return new AppError('UPSTREAM_ERROR', 'The weather service returned unexpected data.', 502);
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function location(raw) {
  return {
    name: String(raw.name ?? ''),
    country: String(raw.country ?? ''),
    lat: num(raw.lat),
    lon: num(raw.lon),
    timezoneOffset: num(raw.timezone) ?? 0,
  };
}

// Turns the provider's current-weather response into our own predictable format.
export function normalizeCurrent(raw) {
  const cond = raw?.weather?.[0];
  if (!raw || !raw.main || !cond || num(raw.main.temp) === null || num(raw.dt) === null) throw invalid();

  return {
    location: location({
      name: raw.name,
      country: raw.sys?.country,
      lat: raw.coord?.lat,
      lon: raw.coord?.lon,
      timezone: raw.timezone,
    }),
    observedAt: raw.dt,
    temperatureC: raw.main.temp,
    feelsLikeC: num(raw.main.feels_like),
    tempMinC: num(raw.main.temp_min),
    tempMaxC: num(raw.main.temp_max),
    description: String(cond.description ?? ''),
    iconCode: String(cond.icon ?? ''),
    humidity: num(raw.main.humidity),
    pressureHpa: num(raw.main.pressure),
    visibilityM: num(raw.visibility),
    cloudiness: num(raw.clouds?.all),
    windSpeedMs: num(raw.wind?.speed),
    windDeg: num(raw.wind?.deg),
    sunrise: num(raw.sys?.sunrise),
    sunset: num(raw.sys?.sunset),
  };
}

export function normalizeForecast(raw) {
  if (!raw || !raw.city || !Array.isArray(raw.list)) throw invalid();

  const list = raw.list
    .filter((item) => item && item.main && item.weather?.[0] && num(item.dt) !== null && num(item.main.temp) !== null)
    .map((item) => ({
      time: item.dt,
      temperatureC: item.main.temp,
      feelsLikeC: num(item.main.feels_like),
      tempMinC: num(item.main.temp_min),
      tempMaxC: num(item.main.temp_max),
      description: String(item.weather[0].description ?? ''),
      iconCode: String(item.weather[0].icon ?? ''),
      humidity: num(item.main.humidity),
      windSpeedMs: num(item.wind?.speed),
      pop: num(item.pop) ?? 0,
    }));

  return {
    location: location({
      name: raw.city.name,
      country: raw.city.country,
      lat: raw.city.coord?.lat,
      lon: raw.city.coord?.lon,
      timezone: raw.city.timezone,
    }),
    list,
  };
}
