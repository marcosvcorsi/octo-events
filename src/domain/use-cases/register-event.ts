import { SaveEventRepository } from '@/domain/contracts/repositories/save-event';
import { Event } from '@/domain/entities/event';

import { SendMailNotification } from '../contracts/send-mail-notification';

export type RegisterEventParams = {
  action: string;
  issue: {
    number: number;
    url: string;
  };
  repository: {
    id: number;
    fullName: string;
  };
  sender: {
    id: number;
    login: string;
  };
};

export class RegisterEvent {
  constructor(
    private readonly eventRepository: SaveEventRepository,
    private readonly sendMailNotification: SendMailNotification,
  ) {}

  async execute(params: RegisterEventParams): Promise<Event> {
    const event = await this.eventRepository.save(params);

    await this.sendMailNotification.send({
      to: 'marcos.corsi@hotmail.com',
      subject: 'New event',
      body: `New event: ${event.action} ${event.repository.fullName}#${event.issue.number}`,
    });

    return event;
  }
}
