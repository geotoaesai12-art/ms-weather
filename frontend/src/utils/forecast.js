import { dayKey } from './time.js';

export function buildHourly(forecast, count = 8) {
  return Array.isArray(forecast?.list) ? forecast.list.slice(0, count) : [];
}

// Groups the 3-hour forecast slots into days (in the city's local time).
export function buildDaily(forecast, maxDays = 5) {
  if (!Array.isArray(forecast?.list) || forecast.list.length === 0) return [];
  const tz = forecast.location?.timezoneOffset ?? 0;

  const groups = new Map();
  for (const item of forecast.list) {
    const key = dayKey(item.time, tz);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  const days = [];
  for (const [key, items] of groups) {
    const maxC = Math.max(...items.map((i) => i.tempMaxC ?? i.temperatureC));
    const minC = Math.min(...items.map((i) => i.tempMinC ?? i.temperatureC));
    const rep = pickRepresentative(items, tz);
    days.push({
      key,
      time: items[0].time,
      maxC,
      minC,
      description: rep.description,
      iconCode: rep.iconCode,
    });
  }
  return days.slice(0, maxDays);
}

// The slot closest to local noon describes the day best.
function pickRepresentative(items, tz) {
  let best = items[0];
  let bestDiff = Infinity;
  for (const item of items) {
    const hour = new Date((item.time + tz) * 1000).getUTCHours();
    const diff = Math.abs(hour - 12);
    if (diff < bestDiff) {
      best = item;
      bestDiff = diff;
    }
  }
  return best;
}
