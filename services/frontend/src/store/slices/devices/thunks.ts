/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  CreateDeviceParamsType,
  CreateDeviceResponseType,
  DeleteDeviceParamsType,
  DeleteDeviceResponseType,
  GetDeviceByIPOrMACParamsType,
  GetDeviceByIPOrMACResponseType,
  GetDeviceParamsType,
  GetDeviceResponseType,
  GetDevicesParamsType,
  GetDevicesResponseType,
  DeviceByIPOrMACUrlParamsType,
  DeviceByIPOrMACUrlPathParamsType,
  DevicesUrlParamsType,
  DeviceUrlParamsType,
  DeviceUrlPathParamsType,
  UpdateDeviceParamsType,
  UpdateDeviceResponseType,
} from './types';
import { config } from '../../../config';

export const DeviceUrl = new Url<DeviceUrlPathParamsType, DeviceUrlParamsType>(
  `${config.urls.apis.iot}/v0/devices/:id`
);
export const DeviceUrlRequest = new Request(DeviceUrl);

export const getDevice = createRequestThunk<GetDeviceResponseType, GetDeviceParamsType>(
  'getDevice',
  async ({ id, access_token }) =>
    DeviceUrlRequest.get({ id, access_token }).then((response) => response.json())
);

export const updateDevice = createRequestThunk<UpdateDeviceResponseType, UpdateDeviceParamsType>(
  'updateDevice',
  async ({ device, access_token }) =>
    DeviceUrlRequest.patch({ id: device.id, access_token }, device).then((response) =>
      response.json()
    )
);

export const deleteDevice = createRequestThunk<DeleteDeviceResponseType, DeleteDeviceParamsType>(
  'deleteDevice',
  async ({ id, access_token }) =>
    DeviceUrlRequest.delete({ id, access_token }).then((response) => response.json())
);

export const DeviceByIPOrMACUrl = new Url<
  DeviceByIPOrMACUrlPathParamsType,
  DeviceByIPOrMACUrlParamsType
>(`${config.urls.apis.iot}/v0/devices/:ip_or_mac`);
export const DeviceByIPOrMACUrlRequest = new Request(DeviceByIPOrMACUrl);

export const getDeviceByIPOrMAC = createRequestThunk<
  GetDeviceByIPOrMACResponseType,
  GetDeviceByIPOrMACParamsType
>('getDeviceByIPOrMAC', async ({ ip_or_mac, access_token }) =>
  DeviceByIPOrMACUrlRequest.get({ ip_or_mac, access_token }).then((response) => response.json())
);

export const DevicesUrl = new Url<null, DevicesUrlParamsType>(`${config.urls.apis.iot}/v0/devices`);
export const DevicesUrlRequest = new Request(DevicesUrl);

export const getDevices = createRequestThunk<GetDevicesResponseType, GetDevicesParamsType>(
  'getDevices',
  async ({
    access_token,
    id,
    mac,
    ip,
    location_id,
    last_message_gte,
    last_message_lte,
    last_message_null,
  }) =>
    DevicesUrlRequest.get({
      access_token,
      id,
      mac,
      ip,
      location_id,
      last_message_gte,
      last_message_lte,
      last_message_null,
    }).then((response) => response.json())
);

export const createDevice = createRequestThunk<CreateDeviceResponseType, CreateDeviceParamsType>(
  'createDevices',
  async ({ device, access_token }) =>
    DevicesUrlRequest.post({ access_token }, device).then((response) => response.json())
);
