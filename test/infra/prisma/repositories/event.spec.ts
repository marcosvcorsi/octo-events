import { mocked } from 'jest-mock';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { SaveEventData } from '@/domain/contracts/repositories/save-event';
import { Event } from '@/domain/entities/event';
import { EventRepository } from '@/infra/prisma/repositories/event';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

describe('EventRepository', () => {
  let event: Event;

  let fakePrismaClient: DeepMockProxy<PrismaClient>;

  let eventRepository: EventRepository;

  beforeAll(() => {
    event = {
      id: 'any_id',
      action: 'opened',
      issue: {
        number: 1,
        url: 'any_url',
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

    fakePrismaClient = mockDeep();

    mocked(PrismaClient).mockImplementation(() => fakePrismaClient);
  });

  beforeEach(() => {
    eventRepository = new EventRepository();
  });

  describe('save', () => {
    let data: SaveEventData;

    beforeAll(() => {
      fakePrismaClient.event.upsert.mockResolvedValue({
        ...event,
        externalId: 1 as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    beforeEach(() => {
      data = {
        action: 'opened',
        issue: {
          number: 1,
          url: 'any_url',
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
    });

    it('should call PrismaClient event upsert with correct values', async () => {
      await eventRepository.save(data);

      expect(fakePrismaClient.event.upsert).toHaveBeenCalledWith({
        create: {
          action: data.action,
          issue: data.issue,
          repository: data.repository,
          sender: data.sender,
          externalId: data.externalId,
        },
        update: {
          action: data.action,
          issue: data.issue,
          repository: data.repository,
          sender: data.sender,
        },
        where: {
          externalId: data.externalId,
        },
      });
      expect(fakePrismaClient.event.upsert).toHaveBeenCalledTimes(1);
    });

    it('should throw if PrismaClient event upsert throws', async () => {
      fakePrismaClient.event.upsert.mockRejectedValueOnce(
        new Error('any_error'),
      );

      await expect(eventRepository.save(data)).rejects.toThrow();
    });

    it('should return a mapped event on success', async () => {
      const result = await eventRepository.save(data);

      expect(result).toMatchObject(event);
    });
  });

  describe('findByIssue', () => {
    let issueNumber: number;

    beforeAll(() => {
      issueNumber = 1;

      fakePrismaClient.event.findMany.mockResolvedValue([
        {
          ...event,
          createdAt: new Date(),
          updatedAt: new Date(),
          externalId: 1 as any,
        },
      ]);
    });

    it('should call PrismaClient event findMany with correct values', async () => {
      await eventRepository.findByIssue(issueNumber);

      expect(fakePrismaClient.event.findMany).toHaveBeenCalledWith({
        where: {
          issue: {
            path: ['number'],
            equals: issueNumber,
          },
        },
      });
      expect(fakePrismaClient.event.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw if PrismaClient event findMany throws', async () => {
      fakePrismaClient.event.findMany.mockRejectedValueOnce(
        new Error('any_error'),
      );

      await expect(eventRepository.findByIssue(issueNumber)).rejects.toThrow();
    });

    it('should return a mapped events on success', async () => {
      const results = await eventRepository.findByIssue(issueNumber);

      expect(results).toEqual([expect.objectContaining(event)]);
    });
  });
});
