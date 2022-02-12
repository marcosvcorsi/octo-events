import { Router } from 'express';
import { container } from 'tsyringe';

import { adaptExpressRouter } from '../adapters/express';

const eventsRouter = Router();

eventsRouter.post(
  '/',
  adaptExpressRouter(container.resolve('RegisterEventController')),
);

export { eventsRouter };
