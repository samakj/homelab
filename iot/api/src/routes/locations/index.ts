/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';
import { LocationSchema } from '@/models/location/schema';

import {
  CreateLocationSchema,
  DeleteLocationSchema,
  GetLocationSchema,
  GetLocationsSchema,
  UpdateLocationSchema,
} from './schemas';
import {
  CreateLocationRouteType,
  DeleteLocationRouteType,
  GetLocationRouteType,
  GetLocationsRouteType,
  UpdateLocationsRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateLocationRouteType>(
    '/locations',
    { schema: CreateLocationSchema },
    async (request, response) => {
      const location = await request.locationsStore.createLocation(request.body);
      return response.code(200).send(location);
    }
  );

  server.get<GetLocationRouteType>(
    '/locations/:id',
    { schema: GetLocationSchema },
    async (request, response) => {
      const location = await request.locationsStore.getLocation(request.params.id);

      if (!location) {
        return response.code(404).send();
      }

      return response.code(200).send(location);
    }
  );

  server.get<GetLocationsRouteType>(
    '/locations',
    { schema: GetLocationsSchema },
    async (request, response) => {
      const locations = await request.locationsStore.getLocations(
        Object.values(extractOperatorsFromQueryParams(request.query, LocationSchema))
      );
      return response.code(200).send(locations);
    }
  );

  server.patch<UpdateLocationsRouteType>(
    '/locations/:id',
    { schema: UpdateLocationSchema },
    async (request, response) => {
      const location = await request.locationsStore.updateLocation({
        ...request.params,
        ...request.body,
      });

      if (!location) {
        return response.code(404).send();
      }

      return response.code(200).send(location);
    }
  );

  server.delete<DeleteLocationRouteType>(
    '/locations/:id',
    { schema: DeleteLocationSchema },
    async (request, response) => {
      const location = await request.locationsStore.deleteLocation(request.params.id);

      return response.code(200).send(location);
    }
  );
};
