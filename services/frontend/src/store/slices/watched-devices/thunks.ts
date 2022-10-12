/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  WatchedDevicesUrlParamsType,
  GetWatchedDevicesParamsType,
  GetWatchedDevicesResponseType,
  WatchDeviceMeasurementsUrlPathParamsType,
  WatchDeviceMeasurementsUrlParamsType,
  WatchDeviceMeasurementsResponseType,
  WatchDeviceMeasurementsParamsType,
  UnwatchDeviceMeasurementsResponseType,
  UnwatchDeviceMeasurementsParamsType,
} from './types';
import { config } from '../../../config';

export const WatchedDevicesUrl = new Url<null, WatchedDevicesUrlParamsType>(
  `${config.urls.scrapers.devices}/v0/watch`
);
export const WatchedDevicesUrlRequest = new Request(WatchedDevicesUrl);

export const getWatchedDevices = createRequestThunk<
  GetWatchedDevicesResponseType,
  GetWatchedDevicesParamsType
>('getWatchedDevices', async ({ access_token }) =>
  WatchedDevicesUrlRequest.get({ access_token }).then((response) => response.json())
);

export const WatchDeviceMeasurementsUrl = new Url<
  WatchDeviceMeasurementsUrlPathParamsType,
  WatchDeviceMeasurementsUrlParamsType
>(`${config.urls.scrapers.devices}/v0/watch/:id/measurements`);
export const WatchDeviceMeasurementsUrlRequest = new Request(WatchDeviceMeasurementsUrl);

export const watchDeviceMeasurements = createRequestThunk<
  WatchDeviceMeasurementsResponseType,
  WatchDeviceMeasurementsParamsType
>('watchDeviceMeasurements', async ({ id, access_token }) =>
  WatchDeviceMeasurementsUrlRequest.post({ id, access_token }).then((response) => response.json())
);

export const unwatchDeviceMeasurements = createRequestThunk<
  UnwatchDeviceMeasurementsResponseType,
  UnwatchDeviceMeasurementsParamsType
>('unwatchDeviceMeasurements', async ({ id, access_token }) =>
  WatchDeviceMeasurementsUrlRequest.delete({ id, access_token }).then((response) => response.json())
);
