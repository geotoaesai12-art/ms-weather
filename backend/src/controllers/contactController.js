import { AppError } from '../utils/AppError.js';
import { validateContactMessage } from '../utils/validators.js';

export function createContactController(mailService) {
  return {
    async send(req, res, next) {
      try {
        const input = validateContactMessage(req.body);
        if (!input.spam) {
          if (!mailService) throw new AppError('CONTACT_UNAVAILABLE', 'Messages cannot be sent right now.', 503);
          await mailService.sendContact(input);
        }
        // Bots get the same answer as real visitors, so they learn nothing.
        res.status(200).json({ data: { sent: true } });
      } catch (err) {
        next(err);
      }
    },
  };
}
