import { mock, MockProxy } from 'jest-mock-extended';

import { Controller } from '@/application/controllers';
import {
  FindIssueEventsController,
  HttpRequest,
} from '@/application/controllers/find-issue-events';
import { Event } from '@/domain/entities/event';
import { FindIssueEvents } from '@/domain/use-cases/find-issue-events';

describe('FindIssueEventsController', () => {
  let findIssueEvents: MockProxy<FindIssueEvents>;
  let httpRequest: HttpRequest;
  let event: Event;

  let findIssueEventsController: Controller;

  beforeAll(() => {
    httpRequest = {
      issueNumber: 1,
    };

    event = {
      id: 'any_id',
      action: 'any_action',
      issue: {
        url: 'any_url',
        number: 1,
      },
      repository: {
        fullName: 'any_full_name',
        id: 1,
      },
      sender: {
        id: 1,
        login: 'any_login',
      },
    };

    findIssueEvents = mock();

    findIssueEvents.execute.mockResolvedValue([event]);
  });

  beforeEach(() => {
    findIssueEventsController = new FindIssueEventsController(findIssueEvents);
  });

  it('should call FindIssueEvents execute with correct params', async () => {
    await findIssueEventsController.handle(httpRequest);

    expect(findIssueEvents.execute).toHaveBeenCalledWith(httpRequest);
    expect(findIssueEvents.execute).toHaveBeenCalledTimes(1);
  });

  it('should return httpResponse with issue events on success', async () => {
    const response = await findIssueEventsController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 200,
      body: [event],
    });
  });

  it('should return httpResponse with error message if register event throws', async () => {
    const error = new Error('any_error');

    findIssueEvents.execute.mockRejectedValueOnce(error);

    const response = await findIssueEventsController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 500,
      body: error.message,
    });
  });

  it('should return httpResponse with default error message if register event throws unknown', async () => {
    findIssueEvents.execute.mockRejectedValueOnce({});

    const response = await findIssueEventsController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 500,
      body: 'Internal Server Error',
    });
  });
});
