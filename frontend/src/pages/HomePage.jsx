import { useEffect, useState } from 'react';
import Hero from '../components/Hero.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import WeatherSkeleton from '../components/WeatherSkeleton.jsx';
import WeatherDashboard from '../components/WeatherDashboard.jsx';
import { useWeather } from '../hooks/useWeather.js';
import { useUnit } from '../hooks/useUnit.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { getCurrentPosition } from '../utils/geolocation.js';
import { storageGet, storageRemove, storageSet } from '../utils/storage.js';

const LAST_CITY_KEY = 'ms-weather:last-city';

export default function HomePage() {
  usePageTitle('MS Weather – Weather, Made Simple');
  const { unit, setUnit } = useUnit();
  const weather = useWeather();
  const [locating, setLocating] = useState(false);
  const { status, query, load } = weather;

  // Load real weather immediately on startup. Use the last searched city,
  // or Islamabad as a sensible default; no placeholder/fake weather is shown.
  useEffect(() => {
    const last = storageGet(LAST_CITY_KEY);
    load({ city: last || 'Islamabad' });
  }, [load]);

  useEffect(() => {
    if (status === 'success' && query?.city) storageSet(LAST_CITY_KEY, query.city);
  }, [status, query]);

  // Real-time: quietly refresh the weather every 10 minutes while the page is open and visible.
  const { refresh } = weather;
  useEffect(() => {
    if (status !== 'success') return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [status, refresh]);

  async function handleUseLocation() {
    setLocating(true);
    try {
      const { lat, lon } = await getCurrentPosition();
      load({ lat: lat.toFixed(4), lon: lon.toFixed(4) });
    } catch (err) {
      weather.fail(err);
    } finally {
      setLocating(false);
    }
  }

  function handleClear() {
    storageRemove(LAST_CITY_KEY);
    weather.reset();
  }

  const isGeoError = weather.error?.code?.startsWith('GEO_');
  const busy = status === 'loading' || locating;

  return (
    <>
      <Hero>
        <SearchBar
          busy={busy}
          onSearch={(city) => load({ city })}
          onClear={handleClear}
          onUseLocation={handleUseLocation}
        />
      </Hero>

      <section className="container dashboard-section" aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'idle' && <EmptyState />}
        {status === 'loading' && <WeatherSkeleton />}
        {status === 'error' && (
          <StatusPanel error={weather.error} onRetry={isGeoError ? handleUseLocation : weather.retry} />
        )}
        {status === 'success' && (
          <WeatherDashboard
            current={weather.current}
            forecast={weather.forecast}
            forecastError={weather.forecastError}
            meta={weather.meta}
            unit={unit}
            onUnitChange={setUnit}
            onRetry={weather.retry}
          />
        )}
      </section>
    </>
  );
}
