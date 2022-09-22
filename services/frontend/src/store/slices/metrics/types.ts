/** @format */

import { RequestMetaType } from '../types';

export interface MetricType {
  id: number;
  name: string;
  abbreviation: string;
  unit: string;
}

export interface MetricUrlPathParamsType {
  id: MetricType['id'];
}

export interface MetricUrlParamsType {
  access_token: string;
}

export interface MetricByNameUrlPathParamsType {
  name: MetricType['name'];
}

export interface MetricByNameUrlParamsType {
  access_token: string;
}

export interface MetricsUrlParamsType {
  access_token: string;
  id?: MetricType['id'] | MetricType['id'][];
  name?: MetricType['name'] | MetricType['name'][];
  abbreviation?: MetricType['abbreviation'] | MetricType['abbreviation'][];
  unit?: MetricType['unit'] | MetricType['unit'][];
}

export interface GetMetricParamsType extends MetricUrlPathParamsType, MetricUrlParamsType {}

export type GetMetricResponseType = MetricType;

export interface GetMetricByNameParamsType
  extends MetricByNameUrlPathParamsType,
    MetricByNameUrlParamsType {}

export type GetMetricByNameResponseType = MetricType;

export interface GetMetricsParamsType extends MetricsUrlParamsType {}

export type GetMetricsResponseType = MetricType[];

export interface CreateMetricParamsType extends MetricsUrlParamsType {
  metric: Omit<MetricType, 'id'>;
}

export type CreateMetricResponseType = MetricType;

export interface UpdateMetricParamsType extends MetricUrlParamsType {
  metric: MetricType;
}

export type UpdateMetricResponseType = MetricType;

export interface DeleteMetricParamsType extends MetricUrlPathParamsType, MetricUrlParamsType {}

export type DeleteMetricResponseType = null;

export interface MetricsStateType {
  [metricId: number]: MetricType;
}

export interface MetricsSliceType {
  requests: {
    getMetric: RequestMetaType;
    getMetricByName: RequestMetaType;
    getMetrics: RequestMetaType;
    createMetric: RequestMetaType;
    updateMetric: RequestMetaType;
    deleteMetric: RequestMetaType;
  };
  metrics?: MetricsStateType;
}
