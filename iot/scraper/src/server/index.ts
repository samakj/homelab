/** @format */
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';

import { errorHandler } from '@/common/error-handler';
import { logger } from '@/common/logger';
import { LocalStorage } from '@/localStorage';
import { LocalStorageType } from '@/localStorage/types';
import { timingMiddleware } from '@/middlewares/timming';

const _server = fastify({ logger });

_server.register(swagger);
_server.register(swaggerUI, {
  routePrefix: 'docs',
  theme: { title: 'IoT Scraper' },
  uiConfig: { filter: true },
});

_server.register(timingMiddleware);
_server.setErrorHandler(errorHandler);

_server.decorate('localStorage', LocalStorage);

_server.get('/devices', () => server.localStorage.devices);

// server.register(v1DevicesRoutes, { prefix: '/v1' });

process.on('SIGINT', () => {
  _server.close();
  process.exit();
});
process.on('SIGTERM', () => {
  _server.close();
  process.exit();
});

export type ServerType = typeof _server & { localStorage: LocalStorageType };
export const server = _server as ServerType;
