import { Event } from '@/domain/entities/event';
import { RegisterEvent } from '@/domain/use-cases/register-event';

import { HttpResponse } from '../contracts/http';

export type HttpRequest = {
  id: number;
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

export class RegisterEventController {
  constructor(private readonly registerEvent: RegisterEvent) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Event | String>> {
    try {
      const event = await this.registerEvent.execute(request);

      return {
        statusCode: 201,
        body: event,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          statusCode: 500,
          body: error.message,
        };
      }

      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }
  }
}
