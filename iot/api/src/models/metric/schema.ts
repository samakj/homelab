/** @format */
import { JSONSchema7 } from 'json-schema';

export const MetricSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'name', 'abbreviation'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    abbreviation: { type: 'string' },
    unit: { type: 'string' },
  },
};
