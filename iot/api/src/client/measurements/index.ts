/** @format */
import {
  CreateMeasurementRouteType,
  DeleteMeasurementRouteType,
  GetMeasurementRouteType,
  GetMeasurementsRouteType,
  UpdateMeasurementsRouteType,
} from '@/routes/measurements/types';

import { axios } from '../axios';
import { APIRequestType } from '../types';

export const createMeasurement: APIRequestType<CreateMeasurementRouteType> = ({
  config,
  ...data
}) => axios.post(`/v1/measurements`, data, config);

export const getMeasurement: APIRequestType<GetMeasurementRouteType> = (options) =>
  axios.get(`/v1/measurements/${options.id}`, options?.config);

export const getMeasurements: APIRequestType<GetMeasurementsRouteType> = (options) =>
  axios.get('/v1/measurements', options?.config);

export const updateMeasurement: APIRequestType<UpdateMeasurementsRouteType> = ({
  id,
  config,
  ...data
}) => axios.patch(`/v1/measurements/${id}`, data, config);

export const deleteMeasurement: APIRequestType<DeleteMeasurementRouteType> = ({ id, config }) =>
  axios.delete(`/v1/measurements/${id}`, config);
