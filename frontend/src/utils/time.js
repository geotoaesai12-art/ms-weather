// OpenWeather gives UNIX seconds (UTC) plus a timezone offset in seconds for the city.
// We shift the timestamp by that offset and format it as UTC, which gives the city's local time.

function shift(unix, tzOffset) {
  return new Date((unix + (tzOffset || 0)) * 1000);
}

function formatter(options) {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' });
}

export function formatTime(unix, tz) {
  return formatter({ hour: 'numeric', minute: '2-digit', hour12: true }).format(shift(unix, tz));
}

export function formatHour(unix, tz) {
  return formatter({ hour: 'numeric', hour12: true }).format(shift(unix, tz));
}

export function formatDateTime(unix, tz) {
  return formatter({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(shift(unix, tz));
}

export function weekdayShort(unix, tz) {
  return formatter({ weekday: 'short' }).format(shift(unix, tz));
}

export function dayMonth(unix, tz) {
  return formatter({ day: 'numeric', month: 'short' }).format(shift(unix, tz));
}

export function dayKey(unix, tz) {
  return shift(unix, tz).toISOString().slice(0, 10);
}

export function isoFromUnix(unix) {
  return new Date(unix * 1000).toISOString();
}

export function formatTimeWithSeconds(unix, tz) {
  return formatter({ hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(shift(unix, tz));
}
