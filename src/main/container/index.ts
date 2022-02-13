import { container } from 'tsyringe';

import { FindIssueEventsController } from '@/application/controllers/find-issue-events';
import { RegisterEventController } from '@/application/controllers/register-event';
import { FindIssueEvents } from '@/domain/use-cases/find-issue-events';
import { RegisterEvent } from '@/domain/use-cases/register-event';
import { EventRepository } from '@/infra/prisma/repositories/event';

container.registerSingleton('EventRepository', EventRepository);

container.register('RegisterEvent', {
  useFactory: () => new RegisterEvent(container.resolve('EventRepository')),
});

container.register('FindIssueEvents', {
  useFactory: () => new FindIssueEvents(container.resolve('EventRepository')),
});

container.register('RegisterEventController', {
  useFactory: () =>
    new RegisterEventController(container.resolve('RegisterEvent')),
});

container.register('FindIssueEventsController', {
  useFactory: () =>
    new FindIssueEventsController(container.resolve('FindIssueEvents')),
});
