import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TTLCache } from '../src/utils/cache.js';

test('cache returns a value before it expires and nothing after', () => {
  let time = 1000;
  const cache = new TTLCache({ now: () => time });
  cache.set('a', 'value', 500);
  assert.equal(cache.get('a').value, 'value');
  time = 1499;
  assert.ok(cache.get('a'));
  time = 1500;
  assert.equal(cache.get('a'), undefined);
});

test('cache never grows beyond maxEntries', () => {
  const cache = new TTLCache({ maxEntries: 2 });
  cache.set('a', 1, 10000);
  cache.set('b', 2, 10000);
  cache.set('c', 3, 10000);
  assert.equal(cache.size, 2);
  assert.equal(cache.get('a'), undefined);
});
