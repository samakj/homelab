/** @format */
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { Any } from '@/@types/any';

import { logger } from './logger';

export const errorHandler = (
  error: FastifyError & Any,
  request: FastifyRequest,
  response: FastifyReply
) => {
  //   logger.error({ err: error, req: request, res: response });
  response.send(error);
};
