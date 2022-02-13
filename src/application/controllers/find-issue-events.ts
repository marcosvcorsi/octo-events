import { Event } from '@/domain/entities/event';
import { FindIssueEvents } from '@/domain/use-cases/find-issue-events';

import { Controller } from '.';
import { HttpResponse } from '../contracts/http';

export type HttpRequest = {
  issueNumber: number;
};

export class FindIssueEventsController
  implements Controller<HttpRequest, HttpResponse<Event[] | string>>
{
  constructor(private readonly findIssueEvents: FindIssueEvents) {}

  async handle({
    issueNumber,
  }: HttpRequest): Promise<HttpResponse<Event[] | string>> {
    try {
      const events = await this.findIssueEvents.execute({
        issueNumber,
      });

      return {
        statusCode: 200,
        body: events,
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
