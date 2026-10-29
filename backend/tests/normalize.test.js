import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCurrent, normalizeForecast } from '../src/utils/normalize.js';
import { rawCurrent, rawForecast } from './helpers.js';

test('current weather is normalized to the app format', () => {
  const data = normalizeCurrent(rawCurrent);
  assert.equal(data.location.name, 'Islamabad');
  assert.equal(data.location.country, 'PK');
  assert.equal(data.location.timezoneOffset, 18000);
  assert.equal(data.temperatureC, 25.4);
  assert.equal(data.iconCode, '01d');
  assert.equal(data.windSpeedMs, 3.1);
  assert.equal(data.sunrise, 1761690000);
});

test('forecast is normalized and keeps pop', () => {
  const data = normalizeForecast(rawForecast);
  assert.equal(data.list.length, 2);
  assert.equal(data.list[0].pop, 0.1);
  assert.equal(data.location.timezoneOffset, 18000);
});

test('unexpected provider data is rejected', () => {
  assert.throws(() => normalizeCurrent({}), { code: 'UPSTREAM_ERROR' });
  assert.throws(() => normalizeForecast({ list: 'nope' }), { code: 'UPSTREAM_ERROR' });
});
