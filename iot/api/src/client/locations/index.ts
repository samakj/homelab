/** @format */
import {
  CreateLocationRouteType,
  DeleteLocationRouteType,
  GetLocationRouteType,
  GetLocationsRouteType,
  UpdateLocationsRouteType,
} from '@/routes/locations/types';

import { axios } from '../axios';
import { APIRequestType } from '../types';

export const createLocation: APIRequestType<CreateLocationRouteType> = ({ config, ...data }) =>
  axios.post(`/v1/locations`, data, config);

export const getLocation: APIRequestType<GetLocationRouteType> = (options) =>
  axios.get(`/v1/locations/${options.id}`, options?.config);

export const getLocations: APIRequestType<GetLocationsRouteType> = (options) =>
  axios.get('/v1/locations', options?.config);

export const updateLocation: APIRequestType<UpdateLocationsRouteType> = ({ id, config, ...data }) =>
  axios.patch(`/v1/locations/${id}`, data, config);

export const deleteLocation: APIRequestType<DeleteLocationRouteType> = ({ id, config }) =>
  axios.delete(`/v1/locations/${id}`, config);
