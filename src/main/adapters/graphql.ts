import { Controller } from '@/application/controllers';

import { logger } from '../utils/logger';

export const adaptGraphqlRouter = async (
  controller: Controller,
  inputOrArgs?: any,
) => {
  const { statusCode, body } = await controller.handle(inputOrArgs);

  if (statusCode >= 400) {
    if (statusCode < 500) {
      logger.warn({ error: body });
    } else {
      logger.error({ error: body });
    }

    throw new Error(body);
  }

  return body;
};
