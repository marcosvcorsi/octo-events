import request from 'supertest';

import { app } from '@/main/app';
import { PrismaClient } from '@prisma/client';

describe('Events Resolver', () => {
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

  describe('POST /graphql mutation saveEvent', () => {
    it('should resolve and register event', async () => {
      const params = {
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
      };

      const response = await request(app)
        .post('/graphql')
        .send({
          query: `mutation {
             saveEvent(input: {
              id: ${params.id},
              action: "${params.action}",
              issue: {
                url: "${params.issue.url}",
                number: ${params.issue.number},
              },
              repository: {
                fullName: "${params.repository.fullName}",
                id: ${params.repository.id},
              },
              sender: {
                id: ${params.sender.id},
                login: "${params.sender.login}",
              }
            }) {
              id
              action
              issue {
                number
                url
              }
              repository {
                id
                fullName
              }
              sender {
                id
                login
              }
              externalId
            }
          }`,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.saveEvent).toEqual({
        ...params,
        id: expect.any(String),
        externalId: params.id,
      });
    });
  });

  describe('POST /graphql query events', () => {
    it('should resolve and return events', async () => {
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

      const response = await request(app)
        .post('/graphql')
        .send({
          query: `{
            events(issueNumber: ${issueNumber}) {
              id
              action
              issue {
                number
                url
              }
              repository {
                id
                fullName
              }
              sender {
                id
                login
              }
              externalId
            }
          }`,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.events).toEqual([
        {
          ...event,
          externalId: Number(event.externalId),
          createdAt: undefined,
          updatedAt: undefined,
        },
      ]);
    });
  });
});
