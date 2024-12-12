/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { LocationSchema } from '@/models/location/schema';

export const CreateLocationSchema: FastifySchema = {
  tags: ['locations'],
  body: omitFromSchema(LocationSchema, ['id']),
  response: {
    200: LocationSchema,
  },
};

export const GetLocationSchema: FastifySchema = {
  tags: ['locations'],
  params: pickFromSchema(LocationSchema, ['id']),
  response: {
    200: LocationSchema,
    404: { type: 'null' },
  },
};

export const GetLocationsSchema: FastifySchema = {
  tags: ['locations'],
  querystring: queryParamFilterFromSchema(LocationSchema),
  response: {
    200: { type: 'array', items: LocationSchema },
  },
};

export const UpdateLocationSchema: FastifySchema = {
  tags: ['locations'],
  params: pickFromSchema(LocationSchema, ['id']),
  body: { ...omitFromSchema(LocationSchema, ['id']), required: [] },
  response: {
    200: LocationSchema,
    404: { type: 'null' },
  },
};

export const DeleteLocationSchema: FastifySchema = {
  tags: ['locations'],
  params: pickFromSchema(LocationSchema, ['id']),
  response: {
    200: pickFromSchema(LocationSchema, ['id']),
  },
};
