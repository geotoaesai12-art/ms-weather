# MS Weather

Weather website: React + Vite frontend, Express backend, OpenWeather data.
Current weather, a 3-hour outlook for each day, and a 5-day forecast for any city.

## Run locally
1. Install Node.js 20.19+ (or 22).
2. `npm run install:all`
3. Copy `backend/.env.example` to `backend/.env` and paste your `OPENWEATHER_API_KEY`.
4. Copy `frontend/.env.example` to `frontend/.env` (leave `VITE_API_BASE_URL` empty locally).
5. `npm run dev`, then open http://localhost:5173
6. `npm test` runs the backend tests (44 tests).

Windows users can double-click `START-MS-WEATHER.bat` instead.

## Go live (Vercel only)
See `DEPLOY-ROMAN-URDU.txt` (Roman Urdu, step by step). Short version:
- Windows: double-click `UPLOAD-TO-GITHUB.bat` to push the code to GitHub (it refuses to upload any `.env` file).
- Import the GitHub repository in Vercel. Keep the Root Directory as it is; `vercel.json` does the rest.
- Environment variables: `OPENWEATHER_API_KEY` (required). For the contact form: `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (optional `CONTACT_FROM`). Optional `VITE_CONTACT_EMAIL` shows a public "Prefer email?" card.
- The website is built from `frontend/` and the API (`api/index.js`, which wraps `backend/`) runs as a Vercel function on the same address, so there is no CORS setup.
- Good weather answers are cached by Vercel's CDN for 5 minutes (also saves your OpenWeather quota).

## Contact form
Visitors write a message on the Contact page; the backend (`POST /api/contact`) emails it to `CONTACT_TO_EMAIL` through the Resend API (no extra dependency, the key stays on the server). Replying in Gmail answers the visitor. Protection: hidden spam-trap field, 5 messages per 10 minutes per visitor, an hourly cap on the server, strict input checks and a small body limit. On Resend's free plan without a verified domain, mail can only be delivered to the address you signed up with, and there is a daily sending limit (check Resend for current limits).

## Security notes
- The API key lives only in `backend/.env` (or the host's environment settings). It is never in the frontend and never committed (`.gitignore`).
- The site makes no requests to third-party websites (no web fonts, no analytics). The API answers its own website; other websites get a 403 unless listed in `ALLOWED_ORIGINS`. Requests are rate limited (60/min per visitor, 30/min for weather lookups).
- Inputs are validated, errors never show stack traces or the key, and the frontend sends a strict Content-Security-Policy.

## Notes
- The free OpenWeather plan gives forecast data in 3-hour steps, so the app shows a "3-Hour Forecast" (not true hourly).
- Caching is in memory plus the CDN cache. On Vercel, in-memory cache and rate limits are per function instance, so treat them as a soft limit.
- Vercel's free Hobby plan is for personal, non-commercial use.
- UI palette: `#000000`, `#830000`, `#BC0202`, `#FF0000` with white surfaces.
- OpenWeather's terms may require attribution depending on your plan. Check your plan before going public and add it if required.

See `docs/ARCHITECTURE.md` and `docs/API_CONTRACT.md`.
