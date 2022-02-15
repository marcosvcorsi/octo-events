import { mocked } from 'jest-mock';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { SaveEventData } from '@/domain/contracts/repositories/save-event';
import { Event } from '@/domain/entities/event';
import { PrismaEventRepository } from '@/infra/prisma/repositories/event';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

describe('PrismaEventRepository', () => {
  let event: Event;

  let fakePrismaClient: DeepMockProxy<PrismaClient>;

  let prismaEventRepository: PrismaEventRepository;

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
    };

    fakePrismaClient = mockDeep();

    mocked(PrismaClient).mockImplementation(() => fakePrismaClient);
  });

  beforeEach(() => {
    prismaEventRepository = new PrismaEventRepository();
  });

  describe('save', () => {
    let data: SaveEventData;

    beforeAll(() => {
      fakePrismaClient.event.create.mockResolvedValue({
        ...event,
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
      };
    });

    it('should call PrismaClient event create with correct values', async () => {
      await prismaEventRepository.save(data);

      expect(fakePrismaClient.event.create).toHaveBeenCalledWith({
        data: {
          action: data.action,
          issue: data.issue,
          repository: data.repository,
          sender: data.sender,
        },
      });
      expect(fakePrismaClient.event.create).toHaveBeenCalledTimes(1);
    });

    it('should throw if PrismaClient event create throws', async () => {
      fakePrismaClient.event.create.mockRejectedValueOnce(
        new Error('any_error'),
      );

      await expect(prismaEventRepository.save(data)).rejects.toThrow();
    });

    it('should return a mapped event on success', async () => {
      const result = await prismaEventRepository.save(data);

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
        },
      ]);
    });

    it('should call PrismaClient event findMany with correct values', async () => {
      await prismaEventRepository.findByIssue(issueNumber);

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

      await expect(
        prismaEventRepository.findByIssue(issueNumber),
      ).rejects.toThrow();
    });

    it('should return a mapped events on success', async () => {
      const results = await prismaEventRepository.findByIssue(issueNumber);

      expect(results).toEqual([expect.objectContaining(event)]);
    });
  });
});
