import nodemailer from 'nodemailer';
import { container } from 'tsyringe';

import { FindIssueEventsController } from '@/application/controllers/find-issue-events';
import { RegisterEventController } from '@/application/controllers/register-event';
import { FindIssueEvents } from '@/domain/use-cases/find-issue-events';
import { RegisterEvent } from '@/domain/use-cases/register-event';
import { SendMailNotificationBull } from '@/infra/bull/send-mail-notification';
import { NodeMailerSendMail } from '@/infra/mail/node-mailer';
import { PrismaEventRepository } from '@/infra/prisma/repositories/event';

import { env } from '../config/env';

container.registerSingleton('EventRepository', PrismaEventRepository);

container.register('SendMail', {
  useFactory: () => {
    const transporter = nodemailer.createTransport(env.mail);

    return new NodeMailerSendMail(transporter);
  },
});

container.register('SendMailNotification', {
  useFactory: () => new SendMailNotificationBull(container.resolve('SendMail')),
});

container.register('RegisterEvent', {
  useFactory: () =>
    new RegisterEvent(
      container.resolve('EventRepository'),
      container.resolve('SendMailNotification'),
    ),
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
