import pino from 'pino';

import { env } from '../config/env';

const logger = pino({
  level: env.logger.level,
});

export { logger };
