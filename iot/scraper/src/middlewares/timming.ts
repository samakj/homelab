/** @format */
import { FastifyPluginAsync } from 'fastify';
import Plugin from 'fastify-plugin';

export const timingMiddleware: FastifyPluginAsync = Plugin(async (server, options) => {
  server.addHook('onRequest', async (request, response) => {
    response.header('X-Request-Start', +new Date());
  });
  server.addHook('onSend', async (request, response) => {
    response.header('X-Request-End', +new Date());
  });
});
