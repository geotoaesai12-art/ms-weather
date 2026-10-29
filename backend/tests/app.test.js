import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { AppError } from '../src/utils/AppError.js';

const config = {
  nodeEnv: 'production',
  isProduction: true,
  allowedOrigins: ['https://ms-weather.example'],
  rateLimit: { windowMs: 60000, limit: 1000 },
  weatherRateLimit: { windowMs: 60000, limit: 1000 },
};

// A fake service: no real network, no real key.
const weatherService = {
  getCurrent: async (loc) => {
    if (loc.type === 'city' && loc.city === 'Nowhereville') throw new AppError('CITY_NOT_FOUND', 'City not found.', 404);
    if (loc.type === 'city' && loc.city === 'Boom') throw new Error('secret stack detail /etc/passwd KEY=abc123');
    return { data: { ok: true }, meta: { cached: false, fetchedAt: 1 } };
  },
  getForecast: async () => ({ data: { list: [] }, meta: { cached: false, fetchedAt: 1 } }),
};

let server;
let base;
before(async () => {
  server = createApp({ config, weatherService }).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('health endpoint works and hides the framework', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-powered-by'), null);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
});

test('unknown route gives a clean 404 JSON', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.code, 'NOT_FOUND');
});

test('allowed website gets CORS headers', async () => {
  const res = await fetch(`${base}/api/health`, { headers: { Origin: 'https://ms-weather.example' } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://ms-weather.example');
});

test('a different website is rejected with 403', async () => {
  const res = await fetch(`${base}/api/weather/current?city=Islamabad`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(res.status, 403);
  assert.equal(res.headers.get('access-control-allow-origin'), null);
  assert.equal((await res.json()).error.code, 'ORIGIN_NOT_ALLOWED');
});

test('our own website address is always allowed (same-origin), even if not in the list', async () => {
  const host = new URL(base).host;
  const res = await fetch(`${base}/api/health`, { headers: { Origin: `http://${host}` } });
  assert.equal(res.status, 200);
});

test('good weather answers may be cached by the CDN, errors never', async () => {
  const ok = await fetch(`${base}/api/weather/current?city=Islamabad`);
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get('cache-control'), /s-maxage=300/);
  const bad = await fetch(`${base}/api/weather/current?city=`);
  assert.equal(bad.status, 400);
  assert.equal(bad.headers.get('cache-control'), 'no-store');
  const nf = await fetch(`${base}/api/nope`);
  assert.equal(nf.headers.get('cache-control'), 'no-store');
});

test('local-only origins are NOT allowed in production', async () => {
  const res = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(res.status, 403);
});

test('bad input is a 400, array/object tricks are rejected too', async () => {
  for (const q of ['', '?city=', '?city=a&city=b', '?city[x]=1', '?lat=abc&lon=1', '?city=%3Cscript%3E']) {
    const res = await fetch(`${base}/api/weather/forecast${q}`);
    assert.equal(res.status, 400, `query "${q}" should be 400`);
  }
});

test('expected errors are friendly, unexpected errors never leak details', async () => {
  const nf = await fetch(`${base}/api/weather/current?city=Nowhereville`);
  assert.equal(nf.status, 404);
  const boom = await fetch(`${base}/api/weather/current?city=Boom`);
  assert.equal(boom.status, 500);
  const text = await boom.text();
  assert.ok(!text.includes('passwd') && !text.includes('abc123') && !text.includes('stack'));
});

test('weather routes are rate limited (own app, so other tests are not counted)', async () => {
  const limited = createApp({ config: { ...config, weatherRateLimit: { windowMs: 60000, limit: 3 } }, weatherService }).listen(0);
  await new Promise((r) => limited.once('listening', r));
  try {
    const url = `http://127.0.0.1:${limited.address().port}/api/weather/current?city=Islamabad`;
    const statuses = [];
    for (let i = 0; i < 5; i++) statuses.push((await fetch(url)).status);
    assert.deepEqual(statuses, [200, 200, 200, 429, 429]);
    const res = await fetch(url);
    assert.equal((await res.json()).error.code, 'RATE_LIMITED');
  } finally {
    limited.close();
  }
});
