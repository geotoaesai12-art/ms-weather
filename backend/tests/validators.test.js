import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLocationQuery, validateCity } from '../src/utils/validators.js';

test('valid city is trimmed and spaces are collapsed', () => {
  assert.equal(validateCity('  New   York '), 'New York');
  assert.equal(validateCity('São Paulo'), 'São Paulo');
});

test('missing city parameter is rejected', () => {
  assert.throws(() => parseLocationQuery({}), { code: 'INVALID_INPUT' });
  assert.throws(() => parseLocationQuery({ city: '' }), { code: 'INVALID_INPUT' });
  assert.throws(() => parseLocationQuery({ city: '   ' }), { code: 'INVALID_INPUT' });
});

test('malformed or too long city is rejected', () => {
  assert.throws(() => validateCity('<script>alert(1)</script>'), { code: 'INVALID_INPUT' });
  assert.throws(() => validateCity('a'.repeat(101)), { code: 'INVALID_INPUT' });
  assert.throws(() => validateCity(['a', 'b']), { code: 'INVALID_INPUT' });
});

test('coordinates are validated', () => {
  assert.deepEqual(parseLocationQuery({ lat: '33.7', lon: '73.0' }), { type: 'coords', lat: 33.7, lon: 73 });
  assert.throws(() => parseLocationQuery({ lat: '999', lon: '73' }), { code: 'INVALID_INPUT' });
  assert.throws(() => parseLocationQuery({ lat: 'abc', lon: '73' }), { code: 'INVALID_INPUT' });
  assert.throws(() => parseLocationQuery({ lat: '33' }), { code: 'INVALID_INPUT' });
});
