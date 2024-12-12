/** @format */
import { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.get(
    '/ping',
    {
      schema: {
        tags: ['misc'],
        response: {
          200: {
            type: 'object',
            required: ['ping'],
            properties: { ping: { type: 'string', const: 'pong' } },
          },
        },
      },
    },
    () => {
      return { ping: 'pong' };
    }
  );
};
