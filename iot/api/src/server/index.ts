/** @format */
import postgres from '@fastify/postgres';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';

import { errorHandler } from '@/common/error-handler';
import { logger } from '@/common/logger';
import config from '@/config.secret.json';
import { databaseDecorator } from '@/decorators/database';
import { timingMiddleware } from '@/middlewares/timming';
import { routes as v1DevicesRoutes } from '@/routes/devices';
import { routes as v1LocationsRoutes } from '@/routes/locations';
import { routes as v1MeasurementsRoutes } from '@/routes/measurements';
import { routes as v1MetricsRoutes } from '@/routes/metrics';
import { routes as v1PingRoutes } from '@/routes/ping';
import { routes as v1SessionsRoutes } from '@/routes/sessions';
import { routes as v1UsersRoutes } from '@/routes/users';
import { DevicesStore } from '@/stores/devices';
import { LocationsStore } from '@/stores/locations';
import { MeasurementsStore } from '@/stores/measurements';
import { MetricsStore } from '@/stores/metrics';

const server = fastify({ logger });

server.register(postgres, {
  user: config.postgres.username,
  password: config.postgres.password,
  host: config.postgres.host,
  port: config.postgres.port,
});
server.register(swagger);
server.register(swaggerUI, {
  routePrefix: 'docs',
  theme: { title: 'IoT API' },
  uiConfig: { filter: true },
});

server.register(databaseDecorator);
server.register(DevicesStore.decorator);
server.register(LocationsStore.decorator);
server.register(MeasurementsStore.decorator);
server.register(MetricsStore.decorator);

server.register(timingMiddleware);
server.setErrorHandler(errorHandler);

server.register(v1DevicesRoutes, { prefix: '/v1' });
server.register(v1LocationsRoutes, { prefix: '/v1' });
server.register(v1MetricsRoutes, { prefix: '/v1' });
server.register(v1MeasurementsRoutes, { prefix: '/v1' });
server.register(v1PingRoutes, { prefix: '/v1' });
// server.register(v1SessionsRoutes, { prefix: '/v1' });
server.register(v1UsersRoutes, { prefix: '/v1' });

process.on('SIGINT', () => {
  server.close();
  process.exit();
});
process.on('SIGTERM', () => {
  server.close();
  process.exit();
});

export { server };
