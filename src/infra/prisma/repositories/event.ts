import { FindEventsByIssueRepository } from '@/domain/contracts/repositories/find-events-by-issue';
import {
  SaveEventData,
  SaveEventRepository,
} from '@/domain/contracts/repositories/save-event';
import { Event } from '@/domain/entities/event';
import { PrismaClient, Event as PrismaEvent } from '@prisma/client';

export class EventRepository
  implements SaveEventRepository, FindEventsByIssueRepository
{
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  private mapPrismaEventToEvent(prismaEvent: PrismaEvent): Event {
    return {
      ...prismaEvent,
      issue: prismaEvent.issue as Event['issue'],
      repository: prismaEvent.repository as Event['repository'],
      sender: prismaEvent.sender as Event['sender'],
      externalId: Number(prismaEvent.externalId),
    };
  }

  async findByIssue(issueNumber: number): Promise<Event[]> {
    const events = await this.prismaClient.event.findMany({
      where: {
        issue: {
          path: ['number'],
          equals: Number(issueNumber),
        },
      },
    });

    return events.map(this.mapPrismaEventToEvent);
  }

  async save(data: SaveEventData): Promise<Event> {
    const { action, issue, repository, sender, externalId } = data;

    const event = await this.prismaClient.event.upsert({
      create: {
        action,
        issue,
        repository,
        sender,
        externalId,
      },
      update: {
        action,
        issue,
        repository,
        sender,
      },
      where: {
        externalId,
      },
    });

    return this.mapPrismaEventToEvent(event);
  }
}
