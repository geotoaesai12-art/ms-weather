export default function WeatherSkeleton() {
  return (
    <div className="dashboard__grid" role="status" aria-label="Loading weather">
      <div className="dashboard__main">
        <div className="card skeleton skeleton--current" />
        <div className="card skeleton skeleton--row" />
        <div className="card skeleton skeleton--row" />
      </div>
      <div className="dashboard__side">
        <div className="card skeleton skeleton--side" />
        <div className="card skeleton skeleton--side-small" />
      </div>
    </div>
  );
}
