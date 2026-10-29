// Fake provider responses. Used ONLY inside automated tests, never in the real app.
export const rawCurrent = {
  coord: { lon: 73.05, lat: 33.72 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  main: { temp: 25.4, feels_like: 25, temp_min: 22, temp_max: 28, pressure: 1012, humidity: 40 },
  visibility: 10000,
  wind: { speed: 3.1, deg: 90 },
  clouds: { all: 0 },
  dt: 1761700000,
  sys: { country: 'PK', sunrise: 1761690000, sunset: 1761730000 },
  timezone: 18000,
  name: 'Islamabad',
};

export const rawForecast = {
  city: { name: 'Islamabad', country: 'PK', coord: { lat: 33.72, lon: 73.05 }, timezone: 18000 },
  list: [
    { dt: 1761705600, main: { temp: 24, feels_like: 24, temp_min: 23, temp_max: 25, humidity: 45 }, weather: [{ description: 'few clouds', icon: '02d' }], wind: { speed: 2 }, pop: 0.1 },
    { dt: 1761716400, main: { temp: 21, feels_like: 21, temp_min: 20, temp_max: 22, humidity: 50 }, weather: [{ description: 'clear sky', icon: '01n' }], wind: { speed: 1 }, pop: 0 },
  ],
};

export function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}
