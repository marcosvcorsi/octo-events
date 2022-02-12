import 'reflect-metadata';
import './config/module-alias';
import './container';

import cors from 'cors';
import express from 'express';

import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

export { app };
