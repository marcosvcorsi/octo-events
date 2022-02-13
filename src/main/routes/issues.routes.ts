import { Router } from 'express';
import { container } from 'tsyringe';

import { adaptExpressRouter } from '../adapters/express';

const issuesRouter = Router();

issuesRouter.get(
  '/:issueNumber/events',
  adaptExpressRouter(container.resolve('FindIssueEventsController')),
);

export { issuesRouter };
