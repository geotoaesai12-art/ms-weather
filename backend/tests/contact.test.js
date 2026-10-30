import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { createMailService } from '../src/services/mailService.js';
import { validateContactMessage } from '../src/utils/validators.js';

const good = { name: 'Ali Khan', email: 'ali@example.org', topic: 'Feedback', message: 'Great site, thank you!', company: '' };

// ---------- validation ----------
test('valid contact message is accepted and cleaned', () => {
  const r = validateContactMessage({ ...good, name: '  Ali \n  Khan ', message: '  Hello there\r\nsecond line  ' });
  assert.equal(r.spam, false);
  assert.equal(r.name, 'Ali Khan');
  assert.equal(r.message, 'Hello there\nsecond line');
});

test('honeypot field marks the message as spam', () => {
  assert.equal(validateContactMessage({ ...good, company: 'Acme' }).spam, true);
});

test('bad contact input is rejected with a friendly 400', () => {
  const bad = [
    null, [], 'text', {},
    { ...good, name: '' }, { ...good, name: 'x'.repeat(101) }, { ...good, name: 42 },
    { ...good, email: 'nope' }, { ...good, email: 'a@b' }, { ...good, email: 'a b@c.com' }, { ...good, email: 'a@b.com\nBcc: x@y.com' },
    { ...good, topic: 'Hacking' }, { ...good, topic: undefined },
    { ...good, message: 'hi' }, { ...good, message: 'x'.repeat(4001) }, { ...good, message: { a: 1 } },
  ];
  for (const input of bad) {
    assert.throws(() => validateContactMessage(input), (e) => e.status === 400 && e.code === 'INVALID_INPUT', JSON.stringify(input)?.slice(0, 60));
  }
});

// ---------- mail service (fake provider, no internet) ----------
function fakeFetch(status = 200, body = { id: 'abc' }) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  fn.calls = calls;
  return fn;
}
const mailOpts = { apiKey: 're_secret_key', toEmail: 'owner@gmail.com', fromEmail: 'MS Weather <onboarding@resend.dev>' };

test('mail service sends the right request to the provider', async () => {
  const f = fakeFetch();
  await createMailService({ ...mailOpts, fetchImpl: f }).sendContact({ name: 'Ali', email: 'ali@example.org', topic: 'Feedback', message: 'Hello' });
  assert.equal(f.calls.length, 1);
  const { url, init } = f.calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(init.headers.Authorization, 'Bearer re_secret_key');
  const payload = JSON.parse(init.body);
  assert.deepEqual(payload.to, ['owner@gmail.com']);
  assert.equal(payload.reply_to, 'ali@example.org');
  assert.equal(payload.from, 'MS Weather <onboarding@resend.dev>');
  assert.match(payload.subject, /Feedback from Ali/);
  assert.match(payload.text, /Message:\nHello/);
});

test('mail service: not configured => 503, provider error => 502 without leaking, timeout => 504, hourly cap => 429', async () => {
  const msg = { name: 'Ali', email: 'ali@example.org', topic: 'Feedback', message: 'Hello' };
  await assert.rejects(createMailService({ apiKey: '', toEmail: '' }).sendContact(msg), (e) => e.status === 503 && e.code === 'CONTACT_UNAVAILABLE');

  const refused = createMailService({ ...mailOpts, fetchImpl: fakeFetch(403, { message: 'You can only send testing emails to your own email address' }) });
  await assert.rejects(refused.sendContact(msg), (e) => {
    assert.equal(e.status, 502);
    assert.ok(!e.message.includes('re_secret_key') && !e.message.includes('testing emails'));
    return true;
  });

  const slow = createMailService({ ...mailOpts, timeoutMs: 20, fetchImpl: (_u, init) => new Promise((_r, rej) => init.signal.addEventListener('abort', () => rej(Object.assign(new Error('x'), { name: 'AbortError' })))) });
  await assert.rejects(slow.sendContact(msg), (e) => e.status === 504);

  let t = 0;
  const capped = createMailService({ ...mailOpts, maxPerHour: 2, now: () => t, fetchImpl: fakeFetch() });
  await capped.sendContact(msg); await capped.sendContact(msg);
  await assert.rejects(capped.sendContact(msg), (e) => e.status === 429);
  t += 61 * 60 * 1000; // an hour later it works again
  await capped.sendContact(msg);
});

// ---------- the HTTP endpoint ----------
const baseConfig = {
  nodeEnv: 'production', isProduction: true, allowedOrigins: ['https://ms-weather.example'],
  rateLimit: { windowMs: 60000, limit: 1000 }, weatherRateLimit: { windowMs: 60000, limit: 1000 },
  contactRateLimit: { windowMs: 60000, limit: 1000 },
};
const weatherService = { getCurrent: async () => ({ data: {}, meta: {} }), getForecast: async () => ({ data: {}, meta: {} }) };

function start(config, mailService) {
  return new Promise((resolve) => {
    const server = createApp({ config, weatherService, mailService }).listen(0, () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}
const post = (base, body, headers = {}) =>
  fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

let ctx; const sent = [];
before(async () => { ctx = await start(baseConfig, { sendContact: async (m) => { sent.push(m); } }); });
after(() => ctx.server.close());

test('POST /api/contact sends the message and answers 200 (no cache)', async () => {
  sent.length = 0;
  const res = await post(ctx.base, good);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await res.json(), { data: { sent: true } });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].email, 'ali@example.org');
});

test('bots (honeypot) get 200 but nothing is sent', async () => {
  sent.length = 0;
  const res = await post(ctx.base, { ...good, company: 'Spam Inc' });
  assert.equal(res.status, 200);
  assert.equal(sent.length, 0);
});

test('invalid, broken, huge and wrong-type bodies are friendly 4xx errors', async () => {
  assert.equal((await post(ctx.base, { ...good, email: 'nope' })).status, 400);
  const broken = await post(ctx.base, '{"name": ');
  assert.equal(broken.status, 400);
  assert.equal((await broken.json()).error.code, 'INVALID_INPUT');
  const huge = await post(ctx.base, { ...good, message: 'x'.repeat(20000) });
  assert.equal(huge.status, 413);
  const plain = await post(ctx.base, 'name=a', { 'Content-Type': 'text/plain' });
  assert.equal(plain.status, 400);
  assert.equal(sent.length, 0);
});

test('GET /api/contact does not exist; another website is blocked with 403', async () => {
  assert.equal((await fetch(`${ctx.base}/api/contact`)).status, 404);
  const evil = await post(ctx.base, good, { Origin: 'https://evil.example' });
  assert.equal(evil.status, 403);
  assert.equal(sent.length, 0);
});

test('when sending is not configured the visitor gets a clean 503', async () => {
  const c = await start(baseConfig, undefined);
  try {
    const res = await post(c.base, good);
    assert.equal(res.status, 503);
    assert.equal((await res.json()).error.code, 'CONTACT_UNAVAILABLE');
  } finally { c.server.close(); }
});

test('a provider failure never leaks details', async () => {
  const c = await start(baseConfig, createMailService({ ...mailOpts, fetchImpl: fakeFetch(500, { message: 'secret internals' }) }));
  try {
    const res = await post(c.base, good);
    assert.equal(res.status, 502);
    const text = await res.text();
    assert.ok(!text.includes('secret') && !text.includes('re_secret_key') && !text.includes('owner@gmail.com'));
  } finally { c.server.close(); }
});

test('contact endpoint is rate limited (own app)', async () => {
  const c = await start({ ...baseConfig, contactRateLimit: { windowMs: 60000, limit: 2 } }, { sendContact: async () => {} });
  try {
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await post(c.base, good)).status);
    assert.deepEqual(statuses, [200, 200, 429, 429]);
  } finally { c.server.close(); }
});

// ---------- hosts that read the body before we do (Vercel-style) ----------
import http from 'node:http';

function vercelStyle(app) {
  // Emulates the host: it reads the whole body first, then exposes req.body as a lazy, already-parsed property.
  return async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8');
    Object.defineProperty(req, 'body', {
      configurable: true, enumerable: true,
      get() {
        if ((req.headers['content-type'] || '').includes('application/json')) {
          try { return raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error('Invalid JSON'), { statusCode: 400 }); }
        }
        return raw;
      },
      set(v) { Object.defineProperty(req, 'body', { configurable: true, enumerable: true, writable: true, value: v }); },
    });
    app(req, res);
  };
}

test('works when the host has already read and parsed the body', async () => {
  const got = [];
  const app = createApp({ config: baseConfig, weatherService, mailService: { sendContact: async (m) => { got.push(m); } } });
  const server = http.createServer(vercelStyle(app)).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const ok = await post(base, good);
    assert.equal(ok.status, 200);
    assert.equal(got.length, 1);
    assert.equal(got[0].name, 'Ali Khan');

    const broken = await post(base, '{"name": ');
    assert.equal(broken.status, 400);
    assert.equal((await broken.json()).error.code, 'INVALID_INPUT');

    const plain = await post(base, 'name=a', { 'Content-Type': 'text/plain' });
    assert.equal(plain.status, 400);

    const huge = await post(base, { ...good, message: 'x'.repeat(20000) });
    assert.equal(huge.status, 413);
    assert.equal(got.length, 1);
  } finally { server.close(); }
});
