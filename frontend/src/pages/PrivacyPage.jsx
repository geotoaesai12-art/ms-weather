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
            <p>When you search, the city name you typed (or, if you click “Use My Location”, your approximate coordinates) is sent to our server so it can fetch weather data from OpenWeather. We do not save individual searches or build profiles of visitors. Our hosting provider may keep standard technical logs (such as request addresses and times) for a short period.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="mail" size={18} /></span>Messages you send us</h2>
            <p>If you use the contact form, your name, email address and message are delivered to us by email through an email delivery service. We use them only to read and reply to your message. Please do not include passwords or other sensitive information.</p>
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
            <p>Weather data is supplied by OpenWeather, and contact messages pass through an email delivery service. Their own privacy policies apply to their services.</p>
          </section>
        </div>
      </div>
    </>
  );
}
