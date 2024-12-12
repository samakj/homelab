/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { DeviceType } from '@/models/device';

export interface CreateDeviceBodyType extends Omit<DeviceType, 'id'> {}

export interface CreateDeviceResponseType {
  200: DeviceType;
}

export interface CreateDeviceRouteType extends RouteGenericInterface {
  Body: CreateDeviceBodyType;
  Reply: CreateDeviceResponseType;
}

export interface GetDeviceParamsType extends Pick<DeviceType, 'id'> {}

export interface GetDeviceResponseType {
  200: DeviceType;
  404: null;
}

export interface GetDeviceRouteType extends RouteGenericInterface {
  Params: GetDeviceParamsType;
  Reply: GetDeviceResponseType;
}

export type GetDevicesQuerystringType = QueryParamFiltersType<DeviceType>;

export interface GetDevicesResponseType {
  200: DeviceType[];
}

export interface GetDevicesRouteType extends RouteGenericInterface {
  Querystring: GetDevicesQuerystringType;
  Reply: GetDevicesResponseType;
}

export interface UpdateDeviceParamsType extends Pick<DeviceType, 'id'> {}

export interface UpdateDevicesBodyType extends Partial<Omit<DeviceType, 'id'>> {}

export interface UpdateDevicesResponseType {
  200: DeviceType;
  404: null;
}

export interface UpdateDevicesRouteType extends RouteGenericInterface {
  Params: UpdateDeviceParamsType;
  Body: UpdateDevicesBodyType;
  Reply: UpdateDevicesResponseType;
}

export interface DeleteDeviceParamsType extends Pick<DeviceType, 'id'> {}

export interface DeleteDeviceResponseType {
  200: Pick<DeviceType, 'id'>;
}

export interface DeleteDeviceRouteType extends RouteGenericInterface {
  Params: DeleteDeviceParamsType;
  Reply: DeleteDeviceResponseType;
}
