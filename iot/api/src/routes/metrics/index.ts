/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';

import {
  CreateMetricSchema,
  DeleteMetricSchema,
  GetMetricSchema,
  GetMetricsSchema,
  UpdateMetricSchema,
} from './schemas';
import {
  CreateMetricRouteType,
  DeleteMetricRouteType,
  GetMetricRouteType,
  GetMetricsRouteType,
  UpdateMetricsRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateMetricRouteType>(
    '/metrics',
    { schema: CreateMetricSchema },
    async (request, response) => {
      const metric = await request.metricsStore.createMetric(request.body);
      return response.code(200).send(metric);
    }
  );

  server.get<GetMetricRouteType>(
    '/metrics/:id',
    { schema: GetMetricSchema },
    async (request, response) => {
      const metric = await request.metricsStore.getMetric(request.params.id);

      if (!metric) {
        return response.code(404).send();
      }

      return response.code(200).send(metric);
    }
  );

  server.get<GetMetricsRouteType>(
    '/metrics',
    { schema: GetMetricsSchema },
    async (request, response) => {
      const metrics = await request.metricsStore.getMetrics(
        Object.values(extractOperatorsFromQueryParams(request.query))
      );
      return response.code(200).send(metrics);
    }
  );

  server.patch<UpdateMetricsRouteType>(
    '/metrics/:id',
    { schema: UpdateMetricSchema },
    async (request, response) => {
      const metric = await request.metricsStore.updateMetric({
        ...request.params,
        ...request.body,
      });

      if (!metric) {
        return response.code(404).send();
      }

      return response.code(200).send(metric);
    }
  );

  server.delete<DeleteMetricRouteType>(
    '/metrics/:id',
    { schema: DeleteMetricSchema },
    async (request, response) => {
      const metric = await request.metricsStore.deleteMetric(request.params.id);

      return response.code(200).send(metric);
    }
  );
};
