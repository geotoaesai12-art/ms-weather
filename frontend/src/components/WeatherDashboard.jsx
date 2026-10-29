import CurrentWeatherCard from './CurrentWeatherCard.jsx';
import HourlyForecast from './HourlyForecast.jsx';
import ForecastList from './ForecastList.jsx';
import HighlightsPanel from './HighlightsPanel.jsx';
import DetailCards from './DetailCards.jsx';
import StatusPanel from './StatusPanel.jsx';
import UnitToggle from './UnitToggle.jsx';
import { ApiError } from '../utils/errors.js';
import { buildDaily, buildHourly } from '../utils/forecast.js';
import { dayKey, weekdayShort, dayMonth } from '../utils/time.js';
import { useState } from 'react';

export default function WeatherDashboard({ current, forecast, forecastError, meta, unit, onUnitChange, onRetry }) {
  const hourlyAll = buildHourly(forecast, 40);
  const daily = buildDaily(forecast);
  const forecastTz = forecast?.location?.timezoneOffset ?? current.location.timezoneOffset ?? 0;
  const todayKey = dayKey(current.observedAt, current.location.timezoneOffset ?? 0);
  const [selectedDayKey, setSelectedDayKey] = useState(todayKey);
  const selectedDay = daily.find((day) => day.key === selectedDayKey) ?? daily[0];
  const hourly = selectedDay ? hourlyAll.filter((item) => dayKey(item.time, forecastTz) === selectedDay.key) : [];
  const selectedDayLabel = selectedDay ? (selectedDay.key === todayKey ? 'Today' : weekdayShort(selectedDay.time, forecastTz)) + `, ${dayMonth(selectedDay.time, forecastTz)}` : '';
  const noForecast = daily.length === 0;

  return (
    <div className="dashboard">
      <div className="dashboard__toolbar">
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>
      <div className="dashboard__grid">
        <div className="dashboard__main">
          <CurrentWeatherCard current={current} unit={unit} meta={meta} />
          {noForecast ? (
            <StatusPanel compact error={forecastError ?? new ApiError('EMPTY_FORECAST')} onRetry={onRetry} />
          ) : (
            <>
              <HourlyForecast items={hourly} unit={unit} timezoneOffset={forecastTz} selectedDay={selectedDay ? { ...selectedDay, label: selectedDayLabel } : null} />
              <ForecastList days={daily} unit={unit} timezoneOffset={forecastTz} todayKey={todayKey} selectedDayKey={selectedDay?.key} onSelectDay={setSelectedDayKey} />
            </>
          )}
        </div>
        <div className="dashboard__side">
          <HighlightsPanel current={current} unit={unit} />
          <DetailCards current={current} />
        </div>
      </div>
    </div>
  );
}
