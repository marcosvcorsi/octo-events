import { mock, MockProxy } from 'jest-mock-extended';

import { FindEventsByIssueRepository } from '@/domain/contracts/repositories/find-events-by-issue';
import { Event } from '@/domain/entities/event';
import { FindIssueEvents } from '@/domain/use-cases/find-issue-events';

describe('FindIssueEvents', () => {
  let eventRepository: MockProxy<FindEventsByIssueRepository>;
  let issueNumber: number;
  let event: Event;

  let findIssueEvents: FindIssueEvents;

  beforeAll(() => {
    issueNumber = 1;

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
      externalId: 1,
    };

    eventRepository = mock();
    eventRepository.findByIssue.mockResolvedValue([event]);
  });

  beforeEach(() => {
    findIssueEvents = new FindIssueEvents(eventRepository);
  });

  it('should call FindEventsByIssue repository with correct params', async () => {
    await findIssueEvents.execute({ issueNumber });

    expect(eventRepository.findByIssue).toHaveBeenCalledWith(issueNumber);
    expect(eventRepository.findByIssue).toHaveBeenCalledTimes(1);
  });

  it('should throw if FindEventsByIssue repository throws', async () => {
    eventRepository.findByIssue.mockRejectedValueOnce(new Error('any_error'));

    await expect(findIssueEvents.execute({ issueNumber })).rejects.toThrow();
  });

  it('should return issue events on success', async () => {
    const result = await findIssueEvents.execute({ issueNumber });

    expect(result).toEqual([event]);
  });
});
