// The backend always sends metric values (Celsius, m/s, metres, hPa).
// All conversions for display happen here so they are easy to test.

export const UNITS = { C: 'C', F: 'F' };

export function cToF(c) {
  return (c * 9) / 5 + 32;
}

export function convertTemp(c, unit) {
  if (typeof c !== 'number' || Number.isNaN(c)) return null;
  return unit === UNITS.F ? cToF(c) : c;
}

export function formatTemp(c, unit) {
  const v = convertTemp(c, unit);
  return v === null ? '–' : `${Math.round(v)}°`;
}

export function formatTempWithUnit(c, unit) {
  const v = convertTemp(c, unit);
  return v === null ? '–' : `${Math.round(v)}°${unit}`;
}

export function formatWindSpeed(ms, unit) {
  if (typeof ms !== 'number') return '–';
  return unit === UNITS.F ? `${Math.round(ms * 2.23694)} mph` : `${Math.round(ms * 3.6)} km/h`;
}

export function formatVisibility(meters, unit) {
  if (typeof meters !== 'number') return '–';
  if (unit === UNITS.F) return `${(meters / 1609.344).toFixed(1)} mi`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatPressure(hpa) {
  return typeof hpa === 'number' ? `${Math.round(hpa)} hPa` : '–';
}

export function formatPercent(value) {
  return typeof value === 'number' ? `${Math.round(value)}%` : '–';
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export function degToCompass(deg) {
  if (typeof deg !== 'number') return '';
  return COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}

export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
