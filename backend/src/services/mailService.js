import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

const RESEND_URL = 'https://api.resend.com/emails';
const HOUR_MS = 60 * 60 * 1000;

function oneLine(value, max) {
  return String(value).replace(/\s+/g, ' ').trim().slice(0, max);
}

// Sends the contact-form message to our own inbox. Visitors never see the key or the inbox address.
export function createMailService({
  apiKey,
  toEmail,
  fromEmail,
  timeoutMs = 8000,
  maxPerHour = 20,
  fetchImpl = fetch,
  now = () => Date.now(),
}) {
  const sentAt = [];

  return {
    isConfigured: () => Boolean(apiKey && toEmail),

    async sendContact({ name, email, topic, message }) {
      if (!apiKey || !toEmail) {
        throw new AppError('CONTACT_UNAVAILABLE', 'Messages cannot be sent right now.', 503);
      }

      // Safety valve: if someone floods the form, stop before the free daily email limit is used up.
      const cutoff = now() - HOUR_MS;
      while (sentAt.length && sentAt[0] < cutoff) sentAt.shift();
      if (sentAt.length >= maxPerHour) {
        throw new AppError('RATE_LIMITED', 'Too many messages right now. Please try again later.', 429);
      }

      const text = [
        'New message from the MS Weather website',
        '',
        `Topic: ${topic}`,
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n');

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetchImpl(RESEND_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'ms-weather-contact/1.0',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email, // pressing Reply in Gmail answers the visitor
            subject: oneLine(`MS Weather: ${topic} from ${name}`, 150),
            text,
          }),
        });
      } catch (err) {
        if (err?.name === 'AbortError') {
          throw new AppError('UPSTREAM_TIMEOUT', 'Sending took too long. Please try again.', 504);
        }
        logger.warn('mail request failed', { name: err?.name });
        throw new AppError('UPSTREAM_ERROR', 'We could not send your message.', 502);
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        let detail = '';
        try {
          detail = String((await response.json())?.message ?? '').slice(0, 200);
        } catch {
          /* no readable body */
        }
        // Only the status and the provider's reason are logged (never the key). Visitors get a generic message.
        logger.warn('mail provider refused the message', { status: response.status, detail });
        throw new AppError('UPSTREAM_ERROR', 'We could not send your message.', 502);
      }

      sentAt.push(now());
    },
  };
}
