/** @format */
import { JSONSchema7 } from 'json-schema';

import { omitFromSchema } from '@/common/schema';

export const UserSchema: JSONSchema7 = {
  type: 'object',
  required: ['id', 'username', 'password', 'scopes'],
  properties: {
    id: { type: 'number' },
    username: { type: 'string' },
    password: { type: 'string' },
    scopes: { type: 'array', items: { type: 'string' } },
  },
};

export const UserNoPasswordSchema = omitFromSchema(UserSchema, ['password']);
