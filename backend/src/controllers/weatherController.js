import { parseLocationQuery } from '../utils/validators.js';

export function createWeatherController(weatherService) {
  return {
    async current(req, res, next) {
      try {
        const location = parseLocationQuery(req.query);
        res.json(await weatherService.getCurrent(location));
      } catch (err) {
        next(err);
      }
    },
    async forecast(req, res, next) {
      try {
        const location = parseLocationQuery(req.query);
        res.json(await weatherService.getForecast(location));
      } catch (err) {
        next(err);
      }
    },
  };
}
