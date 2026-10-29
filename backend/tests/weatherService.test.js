import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWeatherService } from '../src/services/weatherService.js';
import { TTLCache } from '../src/utils/cache.js';
import { jsonResponse, rawCurrent, rawForecast } from './helpers.js';

function makeService(fetchImpl, extra = {}) {
  return createWeatherService({ apiKey: 'test-key', fetchImpl, cache: new TTLCache(), ...extra });
}
const city = { type: 'city', city: 'Islamabad' };

test('valid city request returns normalized current weather', async () => {
  const service = makeService(async () => jsonResponse(rawCurrent));
  const result = await service.getCurrent(city);
  assert.equal(result.data.location.name, 'Islamabad');
  assert.equal(result.meta.cached, false);
});

test('forecast request returns normalized forecast', async () => {
  const service = makeService(async () => jsonResponse(rawForecast));
  const result = await service.getForecast(city);
  assert.equal(result.data.list.length, 2);
});

test('request to provider uses metric units and never leaks the key in errors', async () => {
  let seenUrl;
  const service = makeService(async (url) => {
    seenUrl = url;
    return jsonResponse({}, 404);
  });
  await assert.rejects(service.getCurrent(city), (err) => {
    assert.equal(err.code, 'CITY_NOT_FOUND');
    assert.ok(!JSON.stringify(err).includes('test-key'));
    assert.ok(!err.message.includes('test-key'));
    return true;
  });
  assert.equal(seenUrl.searchParams.get('units'), 'metric');
  assert.equal(seenUrl.searchParams.get('q'), 'Islamabad');
});

test('coordinates are sent as lat/lon', async () => {
  let seenUrl;
  const service = makeService(async (url) => {
    seenUrl = url;
    return jsonResponse(rawCurrent);
  });
  await service.getCurrent({ type: 'coords', lat: 33.7, lon: 73 });
  assert.equal(seenUrl.searchParams.get('lat'), '33.7');
  assert.equal(seenUrl.searchParams.get('lon'), '73');
});

test('provider 401 becomes PROVIDER_AUTH', async () => {
  const service = makeService(async () => jsonResponse({}, 401));
  await assert.rejects(service.getCurrent(city), { code: 'PROVIDER_AUTH', status: 503 });
});

test('missing API key becomes PROVIDER_AUTH without calling the provider', async () => {
  let called = false;
  const service = makeService(async () => { called = true; return jsonResponse(rawCurrent); }, { apiKey: '' });
  await assert.rejects(service.getCurrent(city), { code: 'PROVIDER_AUTH' });
  assert.equal(called, false);
});

test('provider 429 becomes RATE_LIMITED', async () => {
  const service = makeService(async () => jsonResponse({}, 429));
  await assert.rejects(service.getCurrent(city), { code: 'RATE_LIMITED', status: 429 });
});

test('provider 500 becomes UPSTREAM_ERROR', async () => {
  const service = makeService(async () => jsonResponse({}, 500));
  await assert.rejects(service.getCurrent(city), { code: 'UPSTREAM_ERROR', status: 502 });
});

test('request timeout becomes UPSTREAM_TIMEOUT', async () => {
  const service = makeService(async () => {
    const err = new Error('timeout');
    err.name = 'TimeoutError';
    throw err;
  });
  await assert.rejects(service.getCurrent(city), { code: 'UPSTREAM_TIMEOUT', status: 504 });
});

test('network failure becomes UPSTREAM_ERROR', async () => {
  const service = makeService(async () => {
    throw new TypeError('fetch failed');
  });
  await assert.rejects(service.getCurrent(city), { code: 'UPSTREAM_ERROR' });
});

test('second request is served from cache, and expires later', async () => {
  let time = 1_000_000;
  let calls = 0;
  const cache = new TTLCache({ now: () => time });
  const service = createWeatherService({
    apiKey: 'k',
    cache,
    now: () => time,
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse(rawCurrent);
    },
  });

  const first = await service.getCurrent(city);
  const second = await service.getCurrent({ type: 'city', city: 'islamabad' });
  assert.equal(calls, 1);
  assert.equal(first.meta.cached, false);
  assert.equal(second.meta.cached, true);

  time += 10 * 60 * 1000 + 1; // current-weather cache time has passed
  const third = await service.getCurrent(city);
  assert.equal(calls, 2);
  assert.equal(third.meta.cached, false);
});
