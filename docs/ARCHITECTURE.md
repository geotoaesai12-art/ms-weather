# Architecture

Browser (React, Vercel) -> Express API (Render) -> OpenWeather API
                                  |
                                  +-> MongoDB Atlas (WeatherCache, optional)

- The API key and MongoDB URI live only on the backend.
- The frontend only knows VITE_API_BASE_URL (public).
- MongoDB is used only for caching normalized weather responses (TTL index).
  If MongoDB is down, the backend still works by calling OpenWeather directly.
