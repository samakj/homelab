/** @format */
import {
  CreateMetricRouteType,
  DeleteMetricRouteType,
  GetMetricRouteType,
  GetMetricsRouteType,
  UpdateMetricsRouteType,
} from '@/routes/metrics/types';

import { axios } from '../axios';
import { APIRequestType } from '../types';

export const createMetric: APIRequestType<CreateMetricRouteType> = ({ config, ...data }) =>
  axios.post(`/v1/metrics`, data, config);

export const getMetric: APIRequestType<GetMetricRouteType> = (options) =>
  axios.get(`/v1/metrics/${options.id}`, options?.config);

export const getMetrics: APIRequestType<GetMetricsRouteType> = (options) =>
  axios.get('/v1/metrics', options?.config);

export const updateMetric: APIRequestType<UpdateMetricsRouteType> = ({ id, config, ...data }) =>
  axios.patch(`/v1/metrics/${id}`, data, config);

export const deleteMetric: APIRequestType<DeleteMetricRouteType> = ({ id, config }) =>
  axios.delete(`/v1/metrics/${id}`, config);
