/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';

import {
  CreateUserSchema,
  DeleteUserSchema,
  GetUserSchema,
  GetUsersSchema,
  UpdateUserSchema,
} from './schemas';
import {
  CreateUserRouteType,
  DeleteUserRouteType,
  GetUserRouteType,
  GetUsersRouteType,
  UpdateUsersRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateUserRouteType>(
    '/users',
    { schema: CreateUserSchema },
    async (request, response) => {
      const user = await request.usersStore.createUser(request.body);
      return response.code(200).send(user);
    }
  );

  server.get<GetUserRouteType>(
    '/users/:id',
    { schema: GetUserSchema },
    async (request, response) => {
      const user = await request.usersStore.getUser(request.params.id);

      if (!user) {
        return response.code(404).send();
      }

      return response.code(200).send(user);
    }
  );

  server.get<GetUsersRouteType>('/users', { schema: GetUsersSchema }, async (request, response) => {
    const users = await request.usersStore.getUsers(
      Object.values(extractOperatorsFromQueryParams(request.query))
    );
    return response.code(200).send(users);
  });

  server.patch<UpdateUsersRouteType>(
    '/users/:id',
    { schema: UpdateUserSchema },
    async (request, response) => {
      const user = await request.usersStore.updateUser({
        ...request.params,
        ...request.body,
      });

      if (!user) {
        return response.code(404).send();
      }

      return response.code(200).send(user);
    }
  );

  server.delete<DeleteUserRouteType>(
    '/users/:id',
    { schema: DeleteUserSchema },
    async (request, response) => {
      const user = await request.usersStore.deleteUser(request.params.id);

      return response.code(200).send(user);
    }
  );
};
