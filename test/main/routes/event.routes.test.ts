import request from 'supertest';

import { app } from '@/main/app';
import { PrismaClient } from '@prisma/client';

describe('Events Routes', () => {
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

  describe('POST /api/events', () => {
    it('should return 200 and register event', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          id: 1,
          action: 'opened',
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
        });

      expect(response.status).toBe(200);
    });
  });
});
