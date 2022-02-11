import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const { port } = env;

app.listen(port, () => logger.info(`Server is running on port ${port}`));
