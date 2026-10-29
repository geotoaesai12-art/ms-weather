# Architecture

Browser -> Vercel (React site from frontend/ + API function api/index.js) -> OpenWeather API

- `api/index.js` wraps the Express app in `backend/src` as one Vercel serverless function. `vercel.json` sends `/api/*` to it and every other path to the React app.
- The API key lives only in Vercel's environment variables (or `backend/.env` locally). It is never in the frontend.
- The website and the API share one address, so no CORS setup is needed. Other websites are rejected unless listed in `ALLOWED_ORIGINS`.
- Weather answers are cached in memory (per function instance) and by Vercel's CDN for 5 minutes. Errors are never cached.
- MongoDB is not used yet.
