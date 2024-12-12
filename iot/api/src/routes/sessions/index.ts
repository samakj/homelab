/** @format */
import { FastifyPluginAsync } from 'fastify';

import { extractOperatorsFromQueryParams } from '@/common/params';

import {
  CreateSessionSchema,
  DeleteSessionSchema,
  GetSessionSchema,
  GetSessionsSchema,
  LoginSchema,
  LogoutSchema,
  UpdateSessionSchema,
} from './schemas';
import {
  CreateSessionRouteType,
  DeleteSessionRouteType,
  GetSessionRouteType,
  GetSessionsRouteType,
  LoginRouteType,
  LogoutRouteType,
  UpdateSessionsRouteType,
} from './types';

export const routes: FastifyPluginAsync = async (server, options) => {
  server.post<CreateSessionRouteType>(
    '/sessions',
    { schema: CreateSessionSchema },
    async (request, response) => {
      const session = await request.sessionsStore.createSession(request.body);
      return response.code(200).send(session);
    }
  );

  server.get<GetSessionRouteType>(
    '/sessions/:id',
    { schema: GetSessionSchema },
    async (request, response) => {
      const session = await request.sessionsStore.getSession(request.params.id);

      if (!session) {
        return response.code(404).send();
      }

      return response.code(200).send(session);
    }
  );

  server.get<GetSessionsRouteType>(
    '/sessions',
    { schema: GetSessionsSchema },
    async (request, response) => {
      const sessions = await request.sessionsStore.getSessions(
        Object.values(extractOperatorsFromQueryParams(request.query))
      );
      return response.code(200).send(sessions);
    }
  );

  server.patch<UpdateSessionsRouteType>(
    '/sessions/:id',
    { schema: UpdateSessionSchema },
    async (request, response) => {
      const session = await request.sessionsStore.updateSession({
        ...request.params,
        ...request.body,
      });

      if (!session) {
        return response.code(404).send();
      }

      return response.code(200).send(session);
    }
  );

  server.delete<DeleteSessionRouteType>(
    '/sessions/:id',
    { schema: DeleteSessionSchema },
    async (request, response) => {
      const session = await request.sessionsStore.deleteSession(request.params.id);

      return response.code(200).send(session);
    }
  );

  server.post<LoginRouteType>(
    '/sessions/login',
    { schema: LoginSchema },
    async (request, response) => {
      const user = await request.usersStore.validateUserPassword(
        request.body.username,
        request.body.password
      );
      if (user) {
        const session = await request.sessionsStore.createSession({
          user_id: user.id,
          created: new Date().toISOString(),
          disabled: false,
        });
        return response.code(200).send({ user, session });
      }
      return response.code(404);
    }
  );

  server.delete<LogoutRouteType>(
    '/sessions/logout',
    { schema: LogoutSchema },
    async (request, response) => {
      const session = await request.sessionsStore.updateSession({
        id: request.body.id,
        disabled: true,
      });

      if (!session) {
        return response.code(404).send();
      }

      return response.code(200).send(session);
    }
  );
};
