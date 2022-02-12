/* eslint-disable brace-style */
/* eslint-disable indent */
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
        issue: request.issue,
        sender: request.sender,
        repository: request.repository,
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
