import Icon from './Icon.jsx';
import WeatherIcon from './WeatherIcon.jsx';
import { capitalize, convertTemp, formatPercent, formatTempWithUnit, formatWindSpeed } from '../utils/units.js';
import { formatDateTime, formatTimeWithSeconds, isoFromUnix } from '../utils/time.js';
import { moodFromIcon } from '../utils/weatherTheme.js';
import { useNow } from '../hooks/useNow.js';

function minutesAgo(unixSeconds, nowMs) {
  const mins = Math.max(0, Math.floor((nowMs - unixSeconds * 1000) / 60000));
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
}

export default function CurrentWeatherCard({ current, unit, meta }) {
  const now = useNow(1000);
  const { location, observedAt } = current;
  const tz = location.timezoneOffset ?? 0;
  const place = location.country ? `${location.name}, ${location.country}` : location.name;
  const temp = convertTemp(current.temperatureC, unit);
  const description = capitalize(current.description);

  return (
    <article className={`card current current--${moodFromIcon(current.iconCode)}`} aria-labelledby="current-title">
      <div className="current__top">
        <div>
          <div className="current__place">
            <Icon name="pin" size={22} />
            <h2 id="current-title">{place}</h2>
          </div>
          <p className="current__updated">
            Observed <time dateTime={isoFromUnix(observedAt)}>{formatDateTime(observedAt, tz)}</time> ·{' '}
            {minutesAgo(observedAt, now)}
          </p>
          {meta?.cached && meta.fetchedAt && (
            <p className="badge">Saved result from {formatDateTime(meta.fetchedAt, tz)}</p>
          )}
        </div>
        <div className="current__localtime" aria-label={`Local time in ${location.name}`}>
          <Icon name="clock" size={18} />
          <span>{formatTimeWithSeconds(Math.floor(now / 1000), tz)}</span>
          <small>Local time</small>
        </div>
      </div>

      <div className="current__main">
        <WeatherIcon code={current.iconCode} label={description} size={120} />
        <div>
          <p className="current__temp">
            <span>{temp === null ? '–' : Math.round(temp)}</span>
            <sup>°{unit}</sup>
          </p>
          <p className="current__desc">{description}</p>
        </div>
      </div>

      <ul className="current__facts">
        <li>
          <Icon name="thermometer" size={20} />
          <span className="current__fact-label">Feels like</span>
          <strong>{formatTempWithUnit(current.feelsLikeC, unit)}</strong>
        </li>
        <li>
          <Icon name="droplet" size={20} />
          <span className="current__fact-label">Humidity</span>
          <strong>{formatPercent(current.humidity)}</strong>
        </li>
        <li>
          <Icon name="wind" size={20} />
          <span className="current__fact-label">Wind</span>
          <strong>{formatWindSpeed(current.windSpeedMs, unit)}</strong>
        </li>
      </ul>
    </article>
  );
}
