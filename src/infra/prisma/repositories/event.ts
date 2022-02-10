import {
  SaveEventData,
  SaveEventRepository,
} from '@/domain/contracts/repositories/save-event';
import { Event } from '@/domain/entities/event';
import { PrismaClient } from '@prisma/client';

export class EventRepository implements SaveEventRepository {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
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

    return {
      ...event,
      issue: event.issue as Event['issue'],
      repository: event.repository as Event['repository'],
      sender: event.sender as Event['sender'],
      externalId: Number(event.externalId),
    };
  }
}
