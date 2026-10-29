export const MAX_CITY_LENGTH = 100;
const ALLOWED = /^[\p{L}\p{M}0-9 .,'’()-]+$/u;

export function validateCity(raw) {
  const value = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (!value) return { ok: false, message: 'Please enter a city name.' };
  if (value.length > MAX_CITY_LENGTH) {
    return { ok: false, message: `City name is too long (maximum ${MAX_CITY_LENGTH} characters).` };
  }
  if (!ALLOWED.test(value)) {
    return { ok: false, message: 'City names can only contain letters, numbers, spaces and basic punctuation.' };
  }
  return { ok: true, value };
}
