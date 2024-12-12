/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';

import {
  CreateMeasurementSchema,
  DeleteMeasurementSchema,
  GetMeasurementSchema,
  GetMeasurementsSchema,
  UpdateMeasurementSchema,
} from './schemas';
import {
  CreateMeasurementRouteType,
  DeleteMeasurementRouteType,
  GetMeasurementRouteType,
  GetMeasurementsRouteType,
  UpdateMeasurementsRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateMeasurementRouteType>(
    '/measurements',
    { schema: CreateMeasurementSchema },
    async (request, response) => {
      const measurement = await request.measurementsStore.createMeasurement(request.body);
      return response.code(200).send(measurement);
    }
  );

  server.get<GetMeasurementRouteType>(
    '/measurements/:id',
    { schema: GetMeasurementSchema },
    async (request, response) => {
      const measurement = await request.measurementsStore.getMeasurement(request.params.id);

      if (!measurement) {
        return response.code(404).send();
      }

      return response.code(200).send(measurement);
    }
  );

  server.get<GetMeasurementsRouteType>(
    '/measurements',
    { schema: GetMeasurementsSchema },
    async (request, response) => {
      const measurements = await request.measurementsStore.getMeasurements(
        Object.values(extractOperatorsFromQueryParams(request.query))
      );
      return response.code(200).send(measurements);
    }
  );

  server.patch<UpdateMeasurementsRouteType>(
    '/measurements/:id',
    { schema: UpdateMeasurementSchema },
    async (request, response) => {
      const measurement = await request.measurementsStore.updateMeasurement({
        ...request.params,
        ...request.body,
      });

      if (!measurement) {
        return response.code(404).send();
      }

      return response.code(200).send(measurement);
    }
  );

  server.delete<DeleteMeasurementRouteType>(
    '/measurements/:id',
    { schema: DeleteMeasurementSchema },
    async (request, response) => {
      const measurement = await request.measurementsStore.deleteMeasurement(request.params.id);

      return response.code(200).send(measurement);
    }
  );
};
