export class ApiError extends Error {
  constructor(code, status = 0, detail = '') {
    super(code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.detail = detail; // short, friendly text written by our own server (never provider details)
  }
}

// Friendly, non-technical messages only. Never show backend URLs or provider details to visitors.
const ERRORS = {
  INVALID_INPUT: {
    kind: 'search',
    title: 'Invalid city name',
    message: 'Please check the city name and try again.',
    canRetry: false,
  },
  CITY_NOT_FOUND: {
    kind: 'search',
    title: 'City not found',
    message: 'We could not find that city. Check the spelling or try a nearby larger city.',
    canRetry: false,
  },
  RATE_LIMITED: {
    kind: 'cloud',
    title: 'Too many requests',
    message: 'Weather lookups are busy right now. Please wait a moment and try again.',
    canRetry: true,
  },
  PROVIDER_AUTH: {
    kind: 'cloud',
    title: 'Weather service unavailable',
    message: 'We cannot reach our weather data right now. Please try again later.',
    canRetry: true,
  },
  UPSTREAM_TIMEOUT: {
    kind: 'cloud',
    title: 'Taking too long',
    message: 'The weather service is slow to respond. Please try again.',
    canRetry: true,
  },
  REQUEST_TIMEOUT: {
    kind: 'offline',
    title: 'Taking too long',
    message: 'The request timed out. Check your connection and try again.',
    canRetry: true,
  },
  NETWORK: {
    kind: 'offline',
    title: 'You seem to be offline',
    message: 'Check your internet connection and try again.',
    canRetry: true,
  },
  BACKEND_UNAVAILABLE: {
    kind: 'cloud',
    title: 'Weather is unavailable right now',
    message: 'MS Weather could not load data. Please try again in a few moments.',
    canRetry: true,
  },
  UPSTREAM_ERROR: {
    kind: 'cloud',
    title: 'Weather is unavailable right now',
    message: 'The weather service had a problem. Please try again in a few moments.',
    canRetry: true,
  },
  INTERNAL: {
    kind: 'cloud',
    title: 'Something went wrong',
    message: 'Please try again in a few moments.',
    canRetry: true,
  },
  GEO_DENIED: {
    kind: 'location',
    title: 'Location permission denied',
    message: 'Allow location access in your browser, or search for a city instead.',
    canRetry: true,
  },
  GEO_UNAVAILABLE: {
    kind: 'location',
    title: 'Could not find your location',
    message: 'Your device could not provide a location. Try searching for a city instead.',
    canRetry: true,
  },
  EMPTY_FORECAST: {
    kind: 'cloud',
    title: 'Forecast not available',
    message: 'There is no forecast for this location right now.',
    canRetry: true,
  },
  UNKNOWN: {
    kind: 'cloud',
    title: 'Something went wrong',
    message: 'Please try again.',
    canRetry: true,
  },
};

export function describeError(error) {
  return ERRORS[error?.code] ?? ERRORS.UNKNOWN;
}
