/** @format */
import {
  CreateDeviceRouteType,
  DeleteDeviceRouteType,
  GetDeviceRouteType,
  GetDevicesRouteType,
  UpdateDevicesRouteType,
} from '@/routes/devices/types';

import { axios } from '../axios';
import { APIRequestType } from '../types';

export const createDevice: APIRequestType<CreateDeviceRouteType> = ({ config, ...data }) =>
  axios.post(`/v1/devices`, data, config);

export const getDevice: APIRequestType<GetDeviceRouteType> = (options) =>
  axios.get(`/v1/devices/${options.id}`, options?.config);

export const getDevices: APIRequestType<GetDevicesRouteType> = (options) =>
  axios.get('/v1/devices', options?.config);

export const updateDevice: APIRequestType<UpdateDevicesRouteType> = ({ id, config, ...data }) =>
  axios.patch(`/v1/devices/${id}`, data, config);

export const deleteDevice: APIRequestType<DeleteDeviceRouteType> = ({ id, config }) =>
  axios.delete(`/v1/devices/${id}`, config);
