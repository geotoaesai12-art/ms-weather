import WeatherIcon from './WeatherIcon.jsx';
import { capitalize, formatTemp } from '../utils/units.js';
import { dayMonth, weekdayShort } from '../utils/time.js';

export default function ForecastList({ days, unit, timezoneOffset, todayKey, selectedDayKey, onSelectDay }) {
  return (
    <section className="card forecast" aria-labelledby="daily-title">
      <h2 id="daily-title" className="card__title">
        5-Day Forecast
      </h2>
      <ul className="daily">
        {days.map((day) => (
          <li key={day.key} className={`daily__item${day.key === todayKey ? ' daily__item--today' : ''}${day.key === selectedDayKey ? ' daily__item--selected' : ''}`}>
            <button type="button" className="daily__select" onClick={() => onSelectDay(day.key)} aria-pressed={day.key === selectedDayKey} aria-label={`Show hourly forecast for ${day.key === todayKey ? 'today' : weekdayShort(day.time, timezoneOffset)}`}>
              <span className="daily__day">{day.key === todayKey ? 'Today' : weekdayShort(day.time, timezoneOffset)}</span>
              <span className="daily__date">{dayMonth(day.time, timezoneOffset)}</span>
              <WeatherIcon code={day.iconCode} label={capitalize(day.description)} size={44} />
              <span className="daily__temps"><strong>{formatTemp(day.maxC, unit)}</strong> / {formatTemp(day.minC, unit)}</span>
              <span className="daily__desc">{capitalize(day.description)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
