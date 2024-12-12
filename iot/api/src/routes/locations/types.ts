/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { LocationType } from '@/models/location';

export interface CreateLocationBodyType extends Omit<LocationType, 'id'> {}

export interface CreateLocationResponseType {
  200: LocationType;
}

export interface CreateLocationRouteType extends RouteGenericInterface {
  Body: CreateLocationBodyType;
  Reply: CreateLocationResponseType;
}

export interface GetLocationParamsType extends Pick<LocationType, 'id'> {}

export interface GetLocationResponseType {
  200: LocationType;
  404: null;
}

export interface GetLocationRouteType extends RouteGenericInterface {
  Params: GetLocationParamsType;
  Reply: GetLocationResponseType;
}

export interface GetLocationsQuerystringType extends QueryParamFiltersType<LocationType> {}

export interface GetLocationsResponseType {
  200: LocationType[];
}

export interface GetLocationsRouteType extends RouteGenericInterface {
  Querystring: GetLocationsQuerystringType;
  Reply: GetLocationsResponseType;
}

export interface UpdateLocationParamsType extends Pick<LocationType, 'id'> {}

export interface UpdateLocationsBodyType extends Partial<Omit<LocationType, 'id'>> {}

export interface UpdateLocationsResponseType {
  200: LocationType;
  404: null;
}

export interface UpdateLocationsRouteType extends RouteGenericInterface {
  Params: UpdateLocationParamsType;
  Body: UpdateLocationsBodyType;
  Reply: UpdateLocationsResponseType;
}

export interface DeleteLocationParamsType extends Pick<LocationType, 'id'> {}

export interface DeleteLocationResponseType {
  200: Pick<LocationType, 'id'>;
}

export interface DeleteLocationRouteType extends RouteGenericInterface {
  Params: DeleteLocationParamsType;
  Reply: DeleteLocationResponseType;
}
