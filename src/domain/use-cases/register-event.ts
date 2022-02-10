import { SaveEventRepository } from '../contracts/repositories/save-event';
import { Event } from '../entities/event';

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
  externalId: number;
};

export class RegisterEvent {
  constructor(private readonly eventRepository: SaveEventRepository) {}

  async execute(params: RegisterEventParams): Promise<Event> {
    return this.eventRepository.save(params);
  }
}
