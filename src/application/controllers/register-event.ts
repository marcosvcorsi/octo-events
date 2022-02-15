import { Event } from '@/domain/entities/event';
import { RegisterEvent } from '@/domain/use-cases/register-event';

import { Controller } from '.';
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

export class RegisterEventController
  implements Controller<HttpRequest, HttpResponse<Event | String>>
{
  constructor(private readonly registerEvent: RegisterEvent) {}

  async handle(request: HttpRequest): Promise<HttpResponse<Event | String>> {
    try {
      const event = await this.registerEvent.execute({
        action: request.action,
        issue: {
          number: request.issue.number,
          url: request.issue.url,
        },
        sender: {
          id: request.sender.id,
          login: request.sender.login,
        },
        repository: {
          id: request.repository.id,
          fullName: request.repository.fullName,
        },
        externalId: request.id,
      });

      return {
        statusCode: 200,
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
