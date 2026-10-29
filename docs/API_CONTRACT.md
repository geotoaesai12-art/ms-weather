# API contract (frontend <-> backend)

This is the JSON format the frontend expects. The backend returns exactly this.
All values are metric. The frontend converts to Fahrenheit, mph and miles when needed.

Both endpoints accept either `city=<name>` OR `lat=<number>&lon=<number>`.

## GET /api/weather/current
```json
{
  "data": {
    "location": { "name": "", "country": "", "lat": 0, "lon": 0, "timezoneOffset": 0 },
    "observedAt": 0,
    "temperatureC": 0, "feelsLikeC": 0, "tempMinC": 0, "tempMaxC": 0,
    "description": "", "iconCode": "10d",
    "humidity": 0, "pressureHpa": 0, "visibilityM": 0, "cloudiness": 0,
    "windSpeedMs": 0, "windDeg": 0,
    "sunrise": 0, "sunset": 0
  },
  "meta": { "cached": false, "fetchedAt": 0 }
}
```
`observedAt`, `sunrise`, `sunset`, `fetchedAt` are UNIX seconds (UTC). `timezoneOffset` is seconds from UTC.

## GET /api/weather/forecast
```json
{
  "data": {
    "location": { "name": "", "country": "", "lat": 0, "lon": 0, "timezoneOffset": 0 },
    "list": [
      { "time": 0, "temperatureC": 0, "feelsLikeC": 0, "tempMinC": 0, "tempMaxC": 0,
        "description": "", "iconCode": "10d", "humidity": 0, "windSpeedMs": 0, "pop": 0 }
    ]
  },
  "meta": { "cached": false, "fetchedAt": 0 }
}
```
`list` is the provider's 3-hour slots (free plan), oldest first. `pop` is rain probability from 0 to 1.

## Errors
HTTP status 4xx/5xx with:
```json
{ "error": { "code": "CITY_NOT_FOUND", "message": "..." } }
```
Codes: `INVALID_INPUT` (400), `ORIGIN_NOT_ALLOWED` (403), `CITY_NOT_FOUND` (404), `RATE_LIMITED` (429), `PROVIDER_AUTH` (503), `UPSTREAM_TIMEOUT` (504), `UPSTREAM_ERROR` (502), `NOT_FOUND` (404), `INTERNAL` (500).

## GET /api/health
`{ "status": "ok", "uptimeSeconds": 0, "time": "ISO date" }`
