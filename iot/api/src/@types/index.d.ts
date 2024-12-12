/** @format */
import * as fastify from 'fastify';

import { Database } from '@/decorators/database';
import { DevicesStore } from '@/stores/devices';
import { LocationsStore } from '@/stores/locations';
import { MeasurementsStore } from '@/stores/measurements';
import { MetricsStore } from '@/stores/metrics';
import { SessionsStore } from '@/stores/sessions';
import { UsersStore } from '@/stores/users';

declare module 'fastify' {
  export interface FastifyInstance {}

  export interface FastifyRequest {
    database: Database;

    devicesStore: DevicesStore;
    locationsStore: LocationsStore;
    measurementsStore: MeasurementsStore;
    metricsStore: MetricsStore;
    sessionsStore: SessionsStore;
    usersStore: UsersStore;
  }
}
