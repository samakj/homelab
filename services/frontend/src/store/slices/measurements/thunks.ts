/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  CreateMeasurementParamsType,
  CreateMeasurementResponseType,
  GetMeasurementsLatestParamsType,
  GetMeasurementsLatestResponseType,
  GetMeasurementParamsType,
  GetMeasurementResponseType,
  GetMeasurementsParamsType,
  GetMeasurementsResponseType,
  MeasurementsLatestUrlParamsType,
  MeasurementsUrlParamsType,
  MeasurementUrlParamsType,
  MeasurementUrlPathParamsType,
} from './types';
import { config } from '../../../config';

export const MeasurementUrl = new Url<MeasurementUrlPathParamsType, MeasurementUrlParamsType>(
  `${config.urls.apis.iot}/v0/measurements/:id`
);
export const MeasurementUrlRequest = new Request(MeasurementUrl);

export const getMeasurement = createRequestThunk<
  GetMeasurementResponseType,
  GetMeasurementParamsType
>('getMeasurement', async ({ id, access_token }) =>
  MeasurementUrlRequest.get({ id, access_token }).then((response) => response.json())
);

export const MeasurementsLatestUrl = new Url<null, MeasurementsLatestUrlParamsType>(
  `${config.urls.apis.iot}/v0/measurements/latest`
);
export const MeasurementsLatestUrlRequest = new Request(MeasurementsLatestUrl);

export const getMeasurementsLatest = createRequestThunk<
  GetMeasurementsLatestResponseType,
  GetMeasurementsLatestParamsType
>('getMeasurementsLatest', async ({ access_token, id, device_id, metric_id, location_id, tags }) =>
  MeasurementsLatestUrlRequest.get({
    access_token,
    id,
    device_id,
    metric_id,
    location_id,
    tags,
  }).then((response) => response.json())
);

export const MeasurementsUrl = new Url<null, MeasurementsUrlParamsType>(
  `${config.urls.apis.iot}/v0/measurements`
);
export const MeasurementsUrlRequest = new Request(MeasurementsUrl);

export const getMeasurements = createRequestThunk<
  GetMeasurementsResponseType,
  GetMeasurementsParamsType
>(
  'getMeasurements',
  async ({
    access_token,
    id,
    device_id,
    metric_id,
    location_id,
    tags,
    timestamp_gte,
    timestamp_lte,
    value_gte,
    value_lte,
    value,
  }) =>
    MeasurementsUrlRequest.get({
      access_token,
      id,
      device_id,
      metric_id,
      location_id,
      tags,
      timestamp_gte,
      timestamp_lte,
      value_gte,
      value_lte,
      value,
    }).then((response) => response.json())
);

export const createMeasurement = createRequestThunk<
  CreateMeasurementResponseType,
  CreateMeasurementParamsType
>('createMeasurements', async ({ measurement, access_token }) =>
  MeasurementsUrlRequest.post({ access_token }, measurement).then((response) => response.json())
);
