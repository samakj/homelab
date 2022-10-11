/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  CreateMetricParamsType,
  CreateMetricResponseType,
  DeleteMetricParamsType,
  DeleteMetricResponseType,
  GetMetricByNameParamsType,
  GetMetricByNameResponseType,
  GetMetricParamsType,
  GetMetricResponseType,
  GetMetricsParamsType,
  GetMetricsResponseType,
  MetricByNameUrlParamsType,
  MetricByNameUrlPathParamsType,
  MetricsUrlParamsType,
  MetricUrlParamsType,
  MetricUrlPathParamsType,
  UpdateMetricParamsType,
  UpdateMetricResponseType,
} from './types';
import { config } from '../../../config';

export const MetricUrl = new Url<MetricUrlPathParamsType, MetricUrlParamsType>(
  `${config.urls.apis.iot}/v0/metrics/:id`
);
export const MetricUrlRequest = new Request(MetricUrl);

export const getMetric = createRequestThunk<GetMetricResponseType, GetMetricParamsType>(
  'getMetric',
  async ({ id, access_token }) =>
    MetricUrlRequest.get({ id, access_token }).then((response) => response.json())
);

export const updateMetric = createRequestThunk<UpdateMetricResponseType, UpdateMetricParamsType>(
  'updateMetric',
  async ({ metric, access_token }) =>
    MetricUrlRequest.patch({ id: metric.id, access_token }, metric).then((response) =>
      response.json()
    )
);

export const deleteMetric = createRequestThunk<DeleteMetricResponseType, DeleteMetricParamsType>(
  'deleteMetric',
  async ({ id, access_token }) =>
    MetricUrlRequest.delete({ id, access_token }).then((response) => response.json())
);

export const MetricByNameUrl = new Url<MetricByNameUrlPathParamsType, MetricByNameUrlParamsType>(
  `${config.urls.apis.iot}/v0/metrics/:name`
);
export const MetricByNameUrlRequest = new Request(MetricByNameUrl);

export const getMetricByName = createRequestThunk<
  GetMetricByNameResponseType,
  GetMetricByNameParamsType
>('getMetricByName', async ({ name, access_token }) =>
  MetricByNameUrlRequest.get({ name, access_token }).then((response) => response.json())
);

export const MetricsUrl = new Url<null, MetricsUrlParamsType>(`${config.urls.apis.iot}/v0/metrics`);
export const MetricsUrlRequest = new Request(MetricsUrl);

export const getMetrics = createRequestThunk<GetMetricsResponseType, GetMetricsParamsType>(
  'getMetrics',
  async ({ id, name, abbreviation, unit, access_token }) =>
    MetricsUrlRequest.get({ id, name, abbreviation, unit, access_token }).then((response) =>
      response.json()
    )
);

export const createMetric = createRequestThunk<CreateMetricResponseType, CreateMetricParamsType>(
  'createMetrics',
  async ({ metric, access_token }) =>
    MetricsUrlRequest.post({ access_token }, metric).then((response) => response.json())
);
