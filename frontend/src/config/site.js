// Public contact email (optional). Contact page and menu link appear only when a valid address is set.
const RAW_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL || '').trim();
export const CONTACT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(RAW_EMAIL) ? RAW_EMAIL : '';
