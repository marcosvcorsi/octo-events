import request from 'supertest';

import { app } from '@/main/app';
import { PrismaClient } from '@prisma/client';

describe('Issues Routes', () => {
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    prismaClient = new PrismaClient();

    await prismaClient.$connect();
  });

  beforeEach(async () => {
    await prismaClient.event.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('GET /issues/:id/events', () => {
    it('should return 200 with issue events', async () => {
      const issueNumber = 1;

      const event = await prismaClient.event.create({
        data: {
          action: 'opened',
          issue: {
            number: issueNumber,
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
          externalId: 1 as any,
        },
      });

      const response = await request(app).get(
        `/api/issues/${issueNumber}/events`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          ...event,
          externalId: Number(event.externalId),
          createdAt: event.createdAt.toISOString(),
          updatedAt: event.updatedAt?.toISOString(),
        },
      ]);
    });
  });
});
