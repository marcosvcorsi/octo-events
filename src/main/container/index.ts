import { container } from 'tsyringe';

import { RegisterEventController } from '@/application/controllers/register-event';
import { RegisterEvent } from '@/domain/use-cases/register-event';
import { EventRepository } from '@/infra/prisma/repositories/event';

container.registerSingleton('EventRepository', EventRepository);

container.register('RegisterEvent', {
  useFactory: () => new RegisterEvent(container.resolve('EventRepository')),
});

container.register('RegisterEventController', {
  useFactory: () =>
    // eslint-disable-next-line implicit-arrow-linebreak
    new RegisterEventController(container.resolve('RegisterEvent')),
});
