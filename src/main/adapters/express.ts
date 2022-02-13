import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers';

import { logger } from '../utils/logger';

type ExpressRouterAdapter = (controller: Controller) => RequestHandler;

export const adaptExpressRouter: ExpressRouterAdapter =
  (controller) => async (req, res) => {
    const { body, params } = req;

    const response = await controller.handle({
      ...params,
      ...body,
    });

    if (response.statusCode >= 400) {
      if (response.statusCode < 500) {
        logger.warn({ error: response.body });
      } else {
        logger.error({ error: response.body });
      }

      return res.status(response.statusCode).json({ error: response.body });
    }

    return res.status(response.statusCode).json(response.body);
  };
