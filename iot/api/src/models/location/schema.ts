/** @format */
import { JSONSchema7 } from 'json-schema';

export const LocationSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'name', 'tags'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
};
