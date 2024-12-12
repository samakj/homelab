/** @format */
import { JSONSchema7 } from 'json-schema';

export const SessionSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'user_id', 'created', 'disabled'],
  properties: {
    id: { type: 'number' },
    user_id: { type: 'number' },
    created: { type: 'string' },
    disabled: { type: 'boolean' },
  },
};
