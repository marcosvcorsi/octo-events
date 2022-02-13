import { Router } from 'express';

import { eventsRouter } from './events.routes';
import { issuesRouter } from './issues.routes';

const routes = Router();

routes.use('/events', eventsRouter);
routes.use('/issues', issuesRouter);

export { routes };
