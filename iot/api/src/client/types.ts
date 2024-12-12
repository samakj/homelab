/** @format */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RouteGenericInterface } from 'fastify';

import { Any } from '@/@types/any';
import { NonNullableKeys } from '@/@types/objects';

export type APIRequestOptionsType<Params = void, Body = void> = {
  config?: AxiosRequestConfig<Body>;
} & (Body extends void ? {} : Body) &
  (Params extends void ? {} : Params);

export type APIRequestType<
  Route extends RouteGenericInterface,
  Params = Route['Params'],
  Body = Route['Body'],
  Reply = Route['Reply'] extends { 200: Any } ? Route['Reply'][200] : unknown,
> =
  NonNullableKeys<APIRequestOptionsType<Params, Body>> extends never
    ? (options?: APIRequestOptionsType<Params, Body>) => Promise<AxiosResponse<Reply, Body>>
    : (options: APIRequestOptionsType<Params, Body>) => Promise<AxiosResponse<Reply, Body>>;
