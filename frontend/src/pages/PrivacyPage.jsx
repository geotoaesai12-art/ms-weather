import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function PrivacyPage() {
  usePageTitle('Privacy Policy – MS Weather');
  return (
    <>
      <PageHeader icon="shield" title="Privacy Policy" subtitle="MS Weather does not require an account and does not ask for personal information." />
      <div className="container page-body">
        <div className="legal">
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="search" size={18} /></span>What we process</h2>
            <p>When you search, the city name you typed (or, if you click “Use My Location”, your approximate coordinates) is sent to our server so it can fetch weather data from OpenWeather. We do not save individual searches or build profiles of visitors.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="layers" size={18} /></span>What stays in your browser</h2>
            <p>Your theme, temperature unit and last searched city are saved in your browser’s local storage so the site feels familiar when you return. You can clear this at any time in your browser settings.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="locate" size={18} /></span>Location</h2>
            <p>Your location is requested only when you press “Use My Location”, and only if you allow it.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="globe" size={18} /></span>Third parties</h2>
            <p>Weather data is supplied by OpenWeather. Their own privacy policy applies to their service.</p>
          </section>
        </div>
      </div>
    </>
  );
}
