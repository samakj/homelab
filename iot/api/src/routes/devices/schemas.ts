/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { DeviceSchema } from '@/models/device/schema';

export const CreateDeviceSchema: FastifySchema = {
  tags: ['devices'],
  body: omitFromSchema(DeviceSchema, ['id']),
  response: {
    200: DeviceSchema,
  },
};

export const GetDeviceSchema: FastifySchema = {
  tags: ['devices'],
  params: pickFromSchema(DeviceSchema, ['id']),
  response: {
    200: DeviceSchema,
    404: { type: 'null' },
  },
};

export const GetDevicesSchema: FastifySchema = {
  tags: ['devices'],
  querystring: queryParamFilterFromSchema(DeviceSchema),
  response: {
    200: { type: 'array', items: DeviceSchema },
  },
};

export const UpdateDeviceSchema: FastifySchema = {
  tags: ['devices'],
  params: pickFromSchema(DeviceSchema, ['id']),
  body: { ...omitFromSchema(DeviceSchema, ['id']), required: [] },
  response: {
    200: DeviceSchema,
    404: { type: 'null' },
  },
};

export const DeleteDeviceSchema: FastifySchema = {
  tags: ['devices'],
  params: pickFromSchema(DeviceSchema, ['id']),
  response: {
    200: pickFromSchema(DeviceSchema, ['id']),
  },
};
