/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';
import { DeviceSchema } from '@/models/device/schema';

import {
  CreateDeviceSchema,
  DeleteDeviceSchema,
  GetDeviceSchema,
  GetDevicesSchema,
  UpdateDeviceSchema,
} from './schemas';
import {
  CreateDeviceRouteType,
  DeleteDeviceRouteType,
  GetDeviceRouteType,
  GetDevicesRouteType,
  UpdateDevicesRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateDeviceRouteType>(
    '/devices',
    { schema: CreateDeviceSchema },
    async (request, response) => {
      const device = await request.devicesStore.createDevice(request.body);
      return response.code(200).send(device);
    }
  );

  server.get<GetDeviceRouteType>(
    '/devices/:id',
    { schema: GetDeviceSchema },
    async (request, response) => {
      const device = await request.devicesStore.getDevice(request.params.id);

      if (!device) {
        return response.code(404).send();
      }

      return response.code(200).send(device);
    }
  );

  server.get<GetDevicesRouteType>(
    '/devices',
    { schema: GetDevicesSchema },
    async (request, response) => {
      const devices = await request.devicesStore.getDevices(
        Object.values(extractOperatorsFromQueryParams(request.query, DeviceSchema))
      );
      return response.code(200).send(devices);
    }
  );

  server.patch<UpdateDevicesRouteType>(
    '/devices/:id',
    { schema: UpdateDeviceSchema },
    async (request, response) => {
      const device = await request.devicesStore.updateDevice({
        ...request.params,
        ...request.body,
      });

      if (!device) {
        return response.code(404).send();
      }

      return response.code(200).send(device);
    }
  );

  server.delete<DeleteDeviceRouteType>(
    '/devices/:id',
    { schema: DeleteDeviceSchema },
    async (request, response) => {
      const device = await request.devicesStore.deleteDevice(request.params.id);

      return response.code(200).send(device);
    }
  );
};
