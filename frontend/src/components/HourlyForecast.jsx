import WeatherIcon from './WeatherIcon.jsx';
import { capitalize, formatTemp } from '../utils/units.js';
import { formatHour } from '../utils/time.js';

export default function HourlyForecast({ items, unit, timezoneOffset, selectedDay }) {
  return (
    <section className="card forecast" aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="card__title">
        {selectedDay ? `3-Hour Forecast · ${selectedDay.label}` : '3-Hour Forecast'}
      </h2>
      <ul className="hourly" tabIndex={0} aria-label="3-hour forecast, scrollable">
        {items.map((item) => (
          <li key={item.time} className="hourly__item">
            <span className="hourly__time">{formatHour(item.time, timezoneOffset)}</span>
            <WeatherIcon code={item.iconCode} label={capitalize(item.description)} size={36} />
            <span className="hourly__condition">{capitalize(item.description)}</span>
            <strong className="hourly__temperature">{formatTemp(item.temperatureC, unit)}</strong>
            {typeof item.pop === 'number' && item.pop > 0 && (
              <span className="hourly__pop">{Math.round(item.pop * 100)}% rain</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
