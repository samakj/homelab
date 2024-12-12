/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { UserNoPasswordSchema, UserSchema } from '@/models/user/schema';

export const CreateUserSchema: FastifySchema = {
  tags: ['users'],
  body: omitFromSchema(UserSchema, ['id']),
  response: {
    200: UserNoPasswordSchema,
  },
};

export const GetUserSchema: FastifySchema = {
  tags: ['users'],
  params: pickFromSchema(UserNoPasswordSchema, ['id']),
  response: {
    200: UserNoPasswordSchema,
    404: { type: 'null' },
  },
};

export const GetUsersSchema: FastifySchema = {
  tags: ['users'],
  querystring: queryParamFilterFromSchema(UserNoPasswordSchema),
  response: {
    200: { type: 'array', items: UserNoPasswordSchema },
  },
};

export const UpdateUserSchema: FastifySchema = {
  tags: ['users'],
  params: pickFromSchema(UserNoPasswordSchema, ['id']),
  body: { ...omitFromSchema(UserNoPasswordSchema, ['id']), required: [] },
  response: {
    200: UserNoPasswordSchema,
    404: { type: 'null' },
  },
};

export const DeleteUserSchema: FastifySchema = {
  tags: ['users'],
  params: pickFromSchema(UserNoPasswordSchema, ['id']),
  response: {
    200: pickFromSchema(UserNoPasswordSchema, ['id']),
  },
};
