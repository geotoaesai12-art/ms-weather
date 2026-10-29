import { useCallback, useRef, useState } from 'react';
import { getCurrentWeather, getForecast } from '../services/weatherService.js';

const INITIAL = {
  status: 'idle', // idle | loading | success | error
  query: null,
  current: null,
  forecast: null,
  forecastError: null,
  meta: {},
  error: null,
};

export function useWeather() {
  const [state, setState] = useState(INITIAL);
  const lastQuery = useRef(null);
  const requestId = useRef(0);

  const load = useCallback(async (query) => {
    lastQuery.current = query;
    const id = ++requestId.current;
    setState((s) => ({ ...s, status: 'loading', error: null, query }));

    const [currentResult, forecastResult] = await Promise.allSettled([
      getCurrentWeather(query),
      getForecast(query),
    ]);

    // A newer search started while this one was running: ignore this result.
    if (id !== requestId.current) return;

    if (currentResult.status === 'rejected') {
      setState({ ...INITIAL, status: 'error', query, error: currentResult.reason });
      return;
    }

    setState({
      status: 'success',
      query,
      current: currentResult.value.data,
      meta: currentResult.value.meta,
      forecast: forecastResult.status === 'fulfilled' ? forecastResult.value.data : null,
      forecastError: forecastResult.status === 'rejected' ? forecastResult.reason : null,
      error: null,
    });
  }, []);

  // Quietly re-fetches the current city in the background (no loading screen). Errors are ignored: old data stays.
  const refresh = useCallback(async () => {
    const query = lastQuery.current;
    if (!query) return;
    const id = ++requestId.current;
    const [currentResult, forecastResult] = await Promise.allSettled([getCurrentWeather(query), getForecast(query)]);
    if (id !== requestId.current || currentResult.status === 'rejected') return;
    setState((s) => ({
      ...s,
      status: 'success',
      current: currentResult.value.data,
      meta: currentResult.value.meta,
      forecast: forecastResult.status === 'fulfilled' ? forecastResult.value.data : s.forecast,
      forecastError: forecastResult.status === 'rejected' ? forecastResult.reason : null,
    }));
  }, []);

  const retry = useCallback(() => {
    if (lastQuery.current) load(lastQuery.current);
  }, [load]);

  const fail = useCallback((error) => {
    requestId.current += 1;
    setState({ ...INITIAL, status: 'error', error });
  }, []);

  const reset = useCallback(() => {
    requestId.current += 1;
    lastQuery.current = null;
    setState(INITIAL);
  }, []);

  return { ...state, load, refresh, retry, fail, reset };
}
