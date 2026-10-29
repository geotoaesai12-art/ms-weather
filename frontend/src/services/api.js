import { ApiError } from '../utils/errors.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TIMEOUT_MS = 30000; // free hosting can take a while to wake up on the first visit

export async function apiGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
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
    if (code) throw new ApiError(code, response.status);
    if (response.status === 429) throw new ApiError('RATE_LIMITED', 429);
    throw new ApiError('BACKEND_UNAVAILABLE', response.status);
  }

  if (!body || typeof body.data !== 'object' || body.data === null) {
    throw new ApiError('BACKEND_UNAVAILABLE', response.status);
  }
  return { data: body.data, meta: body.meta ?? {} };
}
