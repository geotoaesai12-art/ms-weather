import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

const FEATURES = [
  { icon: 'bolt', title: 'Real-time weather', text: 'Current conditions for any city, with the time of the last observation.' },
  { icon: 'calendar', title: '5-day forecast', text: 'A 3-hour outlook for each day and a five-day forecast in one clean view.' },
  { icon: 'globe', title: 'Any city, worldwide', text: 'Search by name or use your location. Times follow the city you search.' },
  { icon: 'thermometer', title: '°C and °F', text: 'Switch units at any time. We remember your choice in this browser only.' },
  { icon: 'palette', title: 'Light and dark', text: 'A comfortable theme for day or night, on phone, tablet or desktop.' },
  { icon: 'shield', title: 'Private by default', text: 'No accounts. We do not keep a history of what you search.' },
];

export default function AboutPage() {
  usePageTitle('About – MS Weather');
  return (
    <>
      <PageHeader icon="info" title="About MS Weather" subtitle="Weather, made simple." />
      <div className="container page-body">
        <p className="lead">
          MS Weather is a fast, clean weather website. Search a city and see what it is like right now and what is
          coming next. Forecasts are estimates and conditions can change, so check back whenever you need an updated outlook.
        </p>

        <ul className="feature-grid">
          {FEATURES.map((f) => (
            <li key={f.title} className="card feature">
              <span className="tile tile--accent">
                <Icon name={f.icon} size={22} />
              </span>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>

        <p className="page-cta">
          <Link to="/" className="btn btn--primary">
            Check the weather <Icon name="arrowRight" size={18} />
          </Link>
        </p>
      </div>
    </>
  );
}
