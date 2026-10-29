import { Router } from 'express';

export function createWeatherRoutes(controller) {
  const router = Router();
  router.get('/current', controller.current);
  router.get('/forecast', controller.forecast);
  return router;
}
