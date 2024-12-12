/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { SessionType } from '@/models/session';
import { UserNoPasswordType, UserType } from '@/models/user';

export interface CreateSessionBodyType extends Omit<SessionType, 'id'> {}

export interface CreateSessionResponseType {
  200: SessionType;
}

export interface CreateSessionRouteType extends RouteGenericInterface {
  Body: CreateSessionBodyType;
  Reply: CreateSessionResponseType;
}

export interface GetSessionParamsType extends Pick<SessionType, 'id'> {}

export interface GetSessionResponseType {
  200: SessionType;
  404: null;
}

export interface GetSessionRouteType extends RouteGenericInterface {
  Params: GetSessionParamsType;
  Reply: GetSessionResponseType;
}

export type GetSessionsQuerystringType = QueryParamFiltersType<SessionType>;

export interface GetSessionsResponseType {
  200: SessionType[];
}

export interface GetSessionsRouteType extends RouteGenericInterface {
  Querystring: GetSessionsQuerystringType;
  Reply: GetSessionsResponseType;
}

export interface UpdateSessionParamsType extends Pick<SessionType, 'id'> {}

export interface UpdateSessionsBodyType extends Partial<Omit<SessionType, 'id'>> {}

export interface UpdateSessionsResponseType {
  200: SessionType;
  404: null;
}

export interface UpdateSessionsRouteType extends RouteGenericInterface {
  Params: UpdateSessionParamsType;
  Body: UpdateSessionsBodyType;
  Reply: UpdateSessionsResponseType;
}

export interface DeleteSessionParamsType extends Pick<SessionType, 'id'> {}

export interface DeleteSessionResponseType {
  200: Pick<SessionType, 'id'>;
}

export interface DeleteSessionRouteType extends RouteGenericInterface {
  Params: DeleteSessionParamsType;
  Reply: DeleteSessionResponseType;
}

export interface LoginBodyType extends Pick<UserType, 'username' | 'password'> {}

export interface LoginResponseType {
  200: { session: SessionType; user: UserNoPasswordType };
  404: null;
}

export interface LoginRouteType extends RouteGenericInterface {
  Body: LoginBodyType;
  Reply: LoginResponseType;
}

export interface LogoutBodyType extends Pick<SessionType, 'id'> {}

export interface LogoutResponseType {
  200: Pick<SessionType, 'id'>;
  404: null;
}

export interface LogoutRouteType extends RouteGenericInterface {
  Body: LogoutBodyType;
  Reply: LogoutResponseType;
}
