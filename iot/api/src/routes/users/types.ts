/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { UserNoPasswordType, UserType } from '@/models/user';

export interface CreateUserBodyType extends Omit<UserType, 'id'> {}

export interface CreateUserResponseType {
  200: UserNoPasswordType;
}

export interface CreateUserRouteType extends RouteGenericInterface {
  Body: CreateUserBodyType;
  Reply: CreateUserResponseType;
}

export interface GetUserParamsType extends Pick<UserNoPasswordType, 'id'> {}

export interface GetUserResponseType {
  200: UserNoPasswordType;
  404: null;
}

export interface GetUserRouteType extends RouteGenericInterface {
  Params: GetUserParamsType;
  Reply: GetUserResponseType;
}

export type GetUsersQuerystringType = QueryParamFiltersType<UserNoPasswordType>;

export interface GetUsersResponseType {
  200: UserNoPasswordType[];
}

export interface GetUsersRouteType extends RouteGenericInterface {
  Querystring: GetUsersQuerystringType;
  Reply: GetUsersResponseType;
}

export interface UpdateUserParamsType extends Pick<UserNoPasswordType, 'id'> {}

export interface UpdateUsersBodyType extends Partial<Omit<UserNoPasswordType, 'id'>> {}

export interface UpdateUsersResponseType {
  200: UserNoPasswordType;
  404: null;
}

export interface UpdateUsersRouteType extends RouteGenericInterface {
  Params: UpdateUserParamsType;
  Body: UpdateUsersBodyType;
  Reply: UpdateUsersResponseType;
}

export interface DeleteUserParamsType extends Pick<UserNoPasswordType, 'id'> {}

export interface DeleteUserResponseType {
  200: Pick<UserNoPasswordType, 'id'>;
}

export interface DeleteUserRouteType extends RouteGenericInterface {
  Params: DeleteUserParamsType;
  Reply: DeleteUserResponseType;
}
