import Icon from './Icon.jsx';
import {
  degToCompass,
  formatPercent,
  formatPressure,
  formatTempWithUnit,
  formatVisibility,
  formatWindSpeed,
} from '../utils/units.js';

export default function HighlightsPanel({ current, unit }) {
  const compass = degToCompass(current.windDeg);
  const rows = [
    { label: 'Max Temperature', icon: 'thermometer', value: formatTempWithUnit(current.tempMaxC, unit), tone: 'weather'  },
    { label: 'Min Temperature', icon: 'thermometer', value: formatTempWithUnit(current.tempMinC, unit), tone: 'weather'  },
    { label: 'Humidity', icon: 'droplet', value: formatPercent(current.humidity), tone: 'weather'  },
    {
      label: 'Wind Speed',
      icon: 'wind',
      value: `${formatWindSpeed(current.windSpeedMs, unit)}${compass ? ` ${compass}` : ''}`,
      tone: 'weather' ,
    },
    { label: 'Pressure', icon: 'gauge', value: formatPressure(current.pressureHpa), tone: 'weather'  },
    { label: 'Visibility', icon: 'eye', value: formatVisibility(current.visibilityM, unit), tone: 'weather'  },
  ];

  return (
    <section className="card highlights" aria-labelledby="highlights-title">
      <h2 id="highlights-title" className="card__title">
        Today’s Highlights
      </h2>
      <dl className="highlights__list">
        {rows.map((row) => (
          <div key={row.label} className="highlights__row">
            <dt>
              <span className={`tile tile--${row.tone}`}>
                <Icon name={row.icon} size={18} />
              </span>
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
