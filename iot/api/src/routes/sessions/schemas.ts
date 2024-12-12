/** @format */
import { FastifySchema } from 'fastify';

import { omitFromSchema, pickFromSchema, queryParamFilterFromSchema } from '@/common/schema';
import { SessionSchema } from '@/models/session/schema';
import { UserSchema } from '@/models/user/schema';

export const CreateSessionSchema: FastifySchema = {
  tags: ['sessions'],
  body: omitFromSchema(SessionSchema, ['id']),
  response: {
    200: SessionSchema,
  },
};

export const GetSessionSchema: FastifySchema = {
  tags: ['sessions'],
  params: pickFromSchema(SessionSchema, ['id']),
  response: {
    200: SessionSchema,
    404: { type: 'null' },
  },
};

export const GetSessionsSchema: FastifySchema = {
  tags: ['sessions'],
  querystring: queryParamFilterFromSchema(SessionSchema),
  response: {
    200: { type: 'array', items: SessionSchema },
  },
};

export const UpdateSessionSchema: FastifySchema = {
  tags: ['sessions'],
  params: pickFromSchema(SessionSchema, ['id']),
  body: { ...omitFromSchema(SessionSchema, ['id']), required: [] },
  response: {
    200: SessionSchema,
    404: { type: 'null' },
  },
};

export const DeleteSessionSchema: FastifySchema = {
  tags: ['sessions'],
  params: pickFromSchema(SessionSchema, ['id']),
  response: {
    200: pickFromSchema(SessionSchema, ['id']),
  },
};

export const LoginSchema: FastifySchema = {
  tags: ['sessions'],
  params: pickFromSchema(UserSchema, ['username', 'password']),
  response: {
    200: pickFromSchema(UserSchema, ['username', 'password']),
  },
};

export const LogoutSchema: FastifySchema = {
  tags: ['sessions'],
  params: pickFromSchema(SessionSchema, ['id']),
  response: {
    200: pickFromSchema(SessionSchema, ['id']),
    404: null,
  },
};
