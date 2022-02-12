/* eslint-disable operator-linebreak */
/* eslint-disable arrow-parens */
import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers';

import { logger } from '../utils/logger';

type ExpressRouterAdapter = (controller: Controller) => RequestHandler;

export const adaptExpressRouter: ExpressRouterAdapter =
  controller => async (req, res) => {
    const { body } = req;

    const { statusCode, body: data } = await controller.handle({
      ...body,
    });

    if (statusCode >= 400) {
      if (statusCode < 500) {
        logger.warn({ error: data });
      } else {
        logger.error({ error: data });
      }

      return res.status(statusCode).json({ error: data });
    }

    return res.status(statusCode).json(data);
  };
