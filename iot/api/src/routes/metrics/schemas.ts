/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { MetricSchema } from '@/models/metric/schema';

export const CreateMetricSchema: FastifySchema = {
  tags: ['metrics'],
  body: omitFromSchema(MetricSchema, ['id']),
  response: {
    200: MetricSchema,
  },
};

export const GetMetricSchema: FastifySchema = {
  tags: ['metrics'],
  params: pickFromSchema(MetricSchema, ['id']),
  response: {
    200: MetricSchema,
    404: { type: 'null' },
  },
};

export const GetMetricsSchema: FastifySchema = {
  tags: ['metrics'],
  querystring: queryParamFilterFromSchema(MetricSchema),
  response: {
    200: { type: 'array', items: MetricSchema },
  },
};

export const UpdateMetricSchema: FastifySchema = {
  tags: ['metrics'],
  params: pickFromSchema(MetricSchema, ['id']),
  body: { ...omitFromSchema(MetricSchema, ['id']), required: [] },
  response: {
    200: MetricSchema,
    404: { type: 'null' },
  },
};

export const DeleteMetricSchema: FastifySchema = {
  tags: ['metrics'],
  params: pickFromSchema(MetricSchema, ['id']),
  response: {
    200: pickFromSchema(MetricSchema, ['id']),
  },
};
