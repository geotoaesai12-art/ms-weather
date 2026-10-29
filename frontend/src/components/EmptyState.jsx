import StatusIllustration from './StatusIllustration.jsx';

export default function EmptyState() {
  return (
    <div className="card status-panel">
      <StatusIllustration kind="search" />
      <h2 className="status-panel__title">Search for a city</h2>
      <p className="status-panel__message">
        Type a city name above, or use your location, to see the current weather and forecast.
      </p>
    </div>
  );
}
