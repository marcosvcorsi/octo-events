import 'reflect-metadata';
import './config/module-alias';
import './container';

import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { EventResolver } from './graphql/resolvers/event';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.send('ok'));

app.use('/api', routes);

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [EventResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });
}

bootstrap();

export { app };
