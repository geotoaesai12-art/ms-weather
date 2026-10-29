import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function TermsPage() {
  usePageTitle('Terms of Service – MS Weather');
  return (
    <>
      <PageHeader icon="file" title="Terms of Service" subtitle="By using MS Weather you agree to these terms." />
      <div className="container page-body">
        <div className="legal">
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="info" size={18} /></span>Information only</h2>
            <p>Weather information is provided for general purposes. Forecasts can be inaccurate or delayed. Do not rely on MS Weather for safety-critical decisions such as severe weather, travel safety or emergencies; use official local warnings instead.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="shield" size={18} /></span>No warranty</h2>
            <p>The service is provided “as is” and “as available”, without warranties of any kind.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="bolt" size={18} /></span>Acceptable use</h2>
            <p>Do not misuse the service, attempt to disrupt it, or use automated tools to overload it.</p>
          </section>
          <section className="card legal__item">
            <h2><span className="tile tile--accent"><Icon name="refresh" size={18} /></span>Changes</h2>
            <p>We may update the service and these terms from time to time.</p>
          </section>
        </div>
      </div>
    </>
  );
}
