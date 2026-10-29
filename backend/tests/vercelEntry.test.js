import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

// api/index.js is what Vercel runs. Check it loads and answers, without using a real key or the internet.
process.env.OPENWEATHER_API_KEY = '';
process.env.NODE_ENV = 'production';

test('Vercel entry (api/index.js) starts and answers requests', async () => {
  const { default: handler } = await import('../../api/index.js');
  assert.equal(typeof handler, 'function');

  const server = http.createServer(handler).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, 'ok');

    // No API key set => a safe 503, never a crash and never a leak
    const weather = await fetch(`${base}/api/weather/current?city=Islamabad`);
    assert.equal(weather.status, 503);
    assert.equal((await weather.json()).error.code, 'PROVIDER_AUTH');
  } finally {
    server.close();
  }
});
