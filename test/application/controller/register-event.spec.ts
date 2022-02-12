import { mock, MockProxy } from 'jest-mock-extended';

import {
  HttpRequest,
  RegisterEventController,
} from '@/application/controllers/register-event';
import { Event } from '@/domain/entities/event';
import { RegisterEvent } from '@/domain/use-cases/register-event';

describe('RegisterEventController', () => {
  let registerEvent: MockProxy<RegisterEvent>;
  let httpRequest: HttpRequest;
  let event: Event;

  let registerEventController: RegisterEventController;

  beforeAll(() => {
    registerEvent = mock();
  });

  beforeEach(() => {
    httpRequest = {
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
      externalId: 1,
    };

    event = {
      ...httpRequest,
      id: 'any_id',
    };

    registerEvent.execute.mockResolvedValue(event);

    registerEventController = new RegisterEventController(registerEvent);
  });

  it('should call RegisterEvent execute with correct params', async () => {
    await registerEventController.handle(httpRequest);

    expect(registerEvent.execute).toHaveBeenCalledWith(httpRequest);
    expect(registerEvent.execute).toHaveBeenCalledTimes(1);
  });

  it('should return httpResponse with event on success', async () => {
    const response = await registerEventController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 200,
      body: event,
    });
  });

  it('should return httpResponse with error message if register event throws', async () => {
    const error = new Error('any_error');

    registerEvent.execute.mockRejectedValueOnce(error);

    const response = await registerEventController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 500,
      body: error.message,
    });
  });

  it('should return httpResponse with default error message if register event throws unknown', async () => {
    registerEvent.execute.mockRejectedValueOnce({});

    const response = await registerEventController.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 500,
      body: 'Internal Server Error',
    });
  });
});
