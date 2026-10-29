import Icon from './Icon.jsx';
import { degToCompass, formatPercent } from '../utils/units.js';
import { formatTime } from '../utils/time.js';
import { useNow } from '../hooks/useNow.js';

// 0 before sunrise, 100 after sunset, real progress in between.
function daylightPercent(sunrise, sunset, nowSeconds) {
  if (!sunrise || !sunset || sunset <= sunrise) return null;
  if (nowSeconds <= sunrise) return 0;
  if (nowSeconds >= sunset) return 100;
  return Math.round(((nowSeconds - sunrise) / (sunset - sunrise)) * 100);
}

export default function DetailCards({ current }) {
  const now = useNow(30000);
  const tz = current.location.timezoneOffset ?? 0;
  const percent = daylightPercent(current.sunrise, current.sunset, Math.floor(now / 1000));
  const items = [
    { label: 'Sunrise', icon: 'sunrise', value: current.sunrise ? formatTime(current.sunrise, tz) : '–' },
    { label: 'Sunset', icon: 'sunset', value: current.sunset ? formatTime(current.sunset, tz) : '–' },
    {
      label: 'Wind Direction',
      icon: 'compass',
      value: typeof current.windDeg === 'number' ? `${degToCompass(current.windDeg)} (${Math.round(current.windDeg)}°)` : '–',
    },
    { label: 'Cloud Cover', icon: 'cloud', value: formatPercent(current.cloudiness) },
  ];

  return (
    <section className="details" aria-label="Weather details">
      {items.map((item) => (
        <div key={item.label} className="card details__item">
          <span className="details__label">
            <Icon name={item.icon} size={18} />
            {item.label}
          </span>
          <strong className="details__value">{item.value}</strong>
        </div>
      ))}
      {percent !== null && (
        <div className="card details__item details__wide">
          <span className="details__label">
            <Icon name="sun" size={18} />
            Daylight progress
          </span>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <span className="progress__bar" style={{ width: `${percent}%` }} />
          </div>
          <small className="details__hint">
            {percent === 0 ? 'The sun has not risen yet' : percent === 100 ? 'The sun has set' : `${percent}% of daylight has passed`}
          </small>
        </div>
      )}
    </section>
  );
}
