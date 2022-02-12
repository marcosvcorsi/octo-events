import { Router } from 'express';

import { eventsRouter } from './events.routes';

const routes = Router();

routes.use('/events', eventsRouter);

export { routes };
