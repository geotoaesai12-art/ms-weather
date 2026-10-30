import { ApiError } from '../utils/errors.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TIMEOUT_MS = 30000; // free hosting can take a while to wake up on the first visit

function buildUrl(path) {
  return new URL(`${BASE_URL}${path}`, window.location.origin);
}

async function request(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(init.headers ?? {}) },
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw new ApiError('REQUEST_TIMEOUT');
    throw new ApiError(navigator.onLine === false ? 'NETWORK' : 'BACKEND_UNAVAILABLE');
  } finally {
    clearTimeout(timer);
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const code = body?.error?.code;
    if (code) throw new ApiError(code, response.status, String(body.error.message ?? ''));
    if (response.status === 429) throw new ApiError('RATE_LIMITED', 429);
    throw new ApiError('BACKEND_UNAVAILABLE', response.status);
  }
  return { body, status: response.status };
}

export async function apiGet(path, params = {}) {
  const url = buildUrl(path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  const { body, status } = await request(url);
  if (!body || typeof body.data !== 'object' || body.data === null) {
    throw new ApiError('BACKEND_UNAVAILABLE', status);
  }
  return { data: body.data, meta: body.meta ?? {} };
}

export async function apiPost(path, payload) {
  const { body, status } = await request(buildUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!body || typeof body.data !== 'object' || body.data === null) {
    throw new ApiError('BACKEND_UNAVAILABLE', status);
  }
  return body.data;
}
