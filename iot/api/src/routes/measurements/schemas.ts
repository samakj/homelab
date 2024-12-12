/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { DeviceSchema } from '@/models/device/schema';
import { MeasurementSchema } from '@/models/measurement/schema';

export const CreateMeasurementSchema: FastifySchema = {
  tags: ['measurements'],
  body: omitFromSchema(MeasurementSchema, ['id']),
  response: {
    200: MeasurementSchema,
  },
};

export const GetMeasurementSchema: FastifySchema = {
  tags: ['measurements'],
  params: pickFromSchema(MeasurementSchema, ['id']),
  response: {
    200: MeasurementSchema,
    404: { type: 'null' },
  },
};

export const GetMeasurementsSchema: FastifySchema = {
  tags: ['measurements'],
  querystring: queryParamFilterFromSchema(MeasurementSchema),
  response: {
    200: { type: 'array', items: MeasurementSchema },
  },
};

export const UpdateMeasurementSchema: FastifySchema = {
  tags: ['measurements'],
  params: pickFromSchema(MeasurementSchema, ['id']),
  body: { ...omitFromSchema(MeasurementSchema, ['id']), required: [] },
  response: {
    200: MeasurementSchema,
    404: { type: 'null' },
  },
};

export const DeleteMeasurementSchema: FastifySchema = {
  tags: ['measurements'],
  params: pickFromSchema(MeasurementSchema, ['id']),
  response: {
    200: pickFromSchema(MeasurementSchema, ['id']),
  },
};
