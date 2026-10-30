import express, { Router } from 'express';

const MAX_BODY_BYTES = 8 * 1024;
const jsonParser = express.json({ limit: MAX_BODY_BYTES });

function visitorError(status) {
  return Object.assign(new Error('bad request'), { status, expose: true }); // shown as a friendly 4xx
}

// Reads the small JSON body. Works both on plain Express and on hosts (like Vercel) that may already
// have read and parsed the body before our code runs.
function readJsonBody(req, res, next) {
  const declared = Number(req.headers['content-length']);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return next(visitorError(413));

  let platformBody;
  try {
    platformBody = req.body; // on Vercel this is a lazy property that throws for broken JSON
  } catch {
    return next(visitorError(400));
  }
  if (platformBody !== null && typeof platformBody === 'object' && !Buffer.isBuffer(platformBody)) {
    return next(); // already parsed by the host
  }
  return jsonParser(req, res, next);
}

export function createContactRoutes(controller) {
  const router = Router();
  router.post('/', readJsonBody, controller.send);
  return router;
}
