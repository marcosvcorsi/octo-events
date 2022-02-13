import { FindEventsByIssueRepository } from '../contracts/repositories/find-events-by-issue';
import { Event } from '../entities/event';

type FindIssueEventsParams = {
  issueNumber: number;
};

export class FindIssueEvents {
  constructor(private readonly eventRepository: FindEventsByIssueRepository) {}

  async execute({ issueNumber }: FindIssueEventsParams): Promise<Event[]> {
    return this.eventRepository.findByIssue(issueNumber);
  }
}
