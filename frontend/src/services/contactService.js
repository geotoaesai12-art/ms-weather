import { apiPost } from './api.js';

// fields: { name, email, topic, message, company }  ("company" is a hidden spam trap and must stay empty)
export function sendContactMessage(fields) {
  return apiPost('/api/contact', fields);
}
