/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { MetricType } from '@/models/metric';

export interface CreateMetricBodyType extends Omit<MetricType, 'id'> {}

export interface CreateMetricResponseType {
  200: MetricType;
}

export interface CreateMetricRouteType extends RouteGenericInterface {
  Body: CreateMetricBodyType;
  Reply: CreateMetricResponseType;
}

export interface GetMetricParamsType extends Pick<MetricType, 'id'> {}

export interface GetMetricResponseType {
  200: MetricType;
  404: null;
}

export interface GetMetricRouteType extends RouteGenericInterface {
  Params: GetMetricParamsType;
  Reply: GetMetricResponseType;
}

export type GetMetricsQuerystringType = QueryParamFiltersType<MetricType>;

export interface GetMetricsResponseType {
  200: MetricType[];
}

export interface GetMetricsRouteType extends RouteGenericInterface {
  Querystring: GetMetricsQuerystringType;
  Reply: GetMetricsResponseType;
}

export interface UpdateMetricParamsType extends Pick<MetricType, 'id'> {}

export interface UpdateMetricsBodyType extends Partial<Omit<MetricType, 'id'>> {}

export interface UpdateMetricsResponseType {
  200: MetricType;
  404: null;
}

export interface UpdateMetricsRouteType extends RouteGenericInterface {
  Params: UpdateMetricParamsType;
  Body: UpdateMetricsBodyType;
  Reply: UpdateMetricsResponseType;
}

export interface DeleteMetricParamsType extends Pick<MetricType, 'id'> {}

export interface DeleteMetricResponseType {
  200: Pick<MetricType, 'id'>;
}

export interface DeleteMetricRouteType extends RouteGenericInterface {
  Params: DeleteMetricParamsType;
  Reply: DeleteMetricResponseType;
}
