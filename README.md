# MS Weather

Weather website: React + Vite frontend, Express backend, OpenWeather data.
Current weather, a 3-hour outlook for each day, and a 5-day forecast for any city.

## Run locally
1. Install Node.js 20.19+ (or 22).
2. `npm run install:all`
3. Copy `backend/.env.example` to `backend/.env` and paste your `OPENWEATHER_API_KEY`.
4. Copy `frontend/.env.example` to `frontend/.env` (leave `VITE_API_BASE_URL` empty locally).
5. `npm run dev`, then open http://localhost:5173
6. `npm test` runs the backend tests (28 tests).

Windows users can double-click `START-MS-WEATHER.bat` instead.

## Go live
See `DEPLOY-ROMAN-URDU.txt` (Roman Urdu, step by step). Short version:
- Backend on Render (`render.yaml` is included). Set `OPENWEATHER_API_KEY` and `ALLOWED_ORIGINS` (your site URL).
- Frontend on Vercel, Root Directory `frontend`. Set `VITE_API_BASE_URL` to the Render URL and `VITE_CONTACT_EMAIL`.
- `frontend/vercel.json` adds page routing and security headers.

## Security notes
- The API key lives only in `backend/.env` (or the host's environment settings). It is never in the frontend and never committed (`.gitignore`).
- The API only answers the websites listed in `ALLOWED_ORIGINS`; other sites get a 403. Requests are rate limited (60/min per visitor, 30/min for weather lookups).
- Inputs are validated, errors never show stack traces or the key, and the frontend sends a strict Content-Security-Policy.

## Notes
- The free OpenWeather plan gives forecast data in 3-hour steps, so the app shows a "3-Hour Forecast" (not true hourly).
- MongoDB is not used yet; caching is in memory.
- UI palette: `#000000`, `#830000`, `#BC0202`, `#FF0000` with white surfaces.
- OpenWeather's terms may require attribution depending on your plan. Check your plan before going public and add it if required.

See `docs/ARCHITECTURE.md` and `docs/API_CONTRACT.md`.
