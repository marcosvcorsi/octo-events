import { Event } from '@/domain/entities/event';

export interface FindEventsByIssueRepository {
  findByIssue(issueNumber: number): Promise<Event[]>;
}
