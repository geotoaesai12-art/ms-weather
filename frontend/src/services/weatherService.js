import { apiGet } from './api.js';

// query is either { city } or { lat, lon }
export function getCurrentWeather(query) {
  return apiGet('/api/weather/current', query);
}

export function getForecast(query) {
  return apiGet('/api/weather/forecast', query);
}
