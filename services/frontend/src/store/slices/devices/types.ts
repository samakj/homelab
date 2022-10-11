/** @format */

import { RequestMetaType, WebsocketMessageActionsEnum, WebsocketMessageType } from '../types';
import { LocationType } from '../locations/types';

export interface DeviceType {
  id: number;
  mac: string;
  ip: string;
  websocket_path: string;
  location_id: LocationType['id'];
  last_message?: string;
}

export interface DeviceUrlPathParamsType {
  id: DeviceType['id'];
}

export interface DeviceUrlParamsType {
  access_token: string;
}

export interface DeviceByIPOrMACUrlPathParamsType {
  ip_or_mac: DeviceType['ip'] | DeviceType['mac'];
}

export interface DeviceByIPOrMACUrlParamsType {
  access_token: string;
}

export interface DevicesUrlParamsType {
  access_token: string;
  id?: DeviceType['id'] | DeviceType['id'][];
  mac?: DeviceType['mac'] | DeviceType['mac'][];
  ip?: DeviceType['ip'] | DeviceType['ip'][];
  location_id?: DeviceType['location_id'] | DeviceType['location_id'][];
  last_message_gte?: DeviceType['last_message'];
  last_message_lte?: DeviceType['last_message'];
  last_message_null?: boolean;
}

export interface GetDeviceParamsType extends DeviceUrlPathParamsType, DeviceUrlParamsType {}

export type GetDeviceResponseType = DeviceType;

export interface GetDeviceByIPOrMACParamsType
  extends DeviceByIPOrMACUrlPathParamsType,
    DeviceByIPOrMACUrlParamsType {}

export type GetDeviceByIPOrMACResponseType = DeviceType;

export interface GetDevicesParamsType extends DevicesUrlParamsType {}

export type GetDevicesResponseType = DeviceType[];

export interface CreateDeviceParamsType extends DevicesUrlParamsType {
  device: Omit<DeviceType, 'id'>;
}

export type CreateDeviceResponseType = DeviceType;

export interface UpdateDeviceParamsType extends DeviceUrlParamsType {
  device: DeviceType;
}

export type UpdateDeviceResponseType = DeviceType;

export interface DeleteDeviceParamsType extends DeviceUrlPathParamsType, DeviceUrlParamsType {}

export type DeleteDeviceResponseType = null;

export interface DevicesWebsocketUrlParamsType {
  access_token: string;
}

export interface CreateDeviceWebsocketMessageType
  extends WebsocketMessageType<
    'device',
    'device',
    DeviceType,
    WebsocketMessageActionsEnum.CREATE
  > {}

export interface UpdateDeviceWebsocketMessageType
  extends WebsocketMessageType<
    'device',
    'device' | 'oldDevice',
    DeviceType,
    WebsocketMessageActionsEnum.UPDATE
  > {}

export interface DeleteDeviceWebsocketMessageType
  extends WebsocketMessageType<
    'device',
    'device',
    Pick<DeviceType, 'id'>,
    WebsocketMessageActionsEnum.DELETE
  > {}

export type DeviceWebsocketMessageType =
  | CreateDeviceWebsocketMessageType
  | UpdateDeviceWebsocketMessageType
  | DeleteDeviceWebsocketMessageType;

export const isCreateDeviceWebsocketMessageType = (
  message: DeviceWebsocketMessageType
): message is CreateDeviceWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.CREATE;

export const isUpdateDeviceWebsocketMessageType = (
  message: DeviceWebsocketMessageType
): message is UpdateDeviceWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.UPDATE;

export const isDeleteDeviceWebsocketMessageType = (
  message: DeviceWebsocketMessageType
): message is DeleteDeviceWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.DELETE;

export interface UseDevicesWebsocketPropsType {
  onOpen?: (event: Event, websocket: WebSocket | null) => void;
  onMessage?: (
    event: MessageEvent<string>,
    data: DeviceWebsocketMessageType,
    websocket: WebSocket | null
  ) => void;
  onError?: (event: Event, websocket: WebSocket | null) => void;
  onClose?: (event: CloseEvent, websocket: WebSocket | null) => void;
  access_token?: string;
}

export interface DevicesStateType {
  [deviceId: number]: DeviceType;
}

export interface DevicesSliceType {
  requests: {
    getDevice: RequestMetaType;
    getDeviceByIPOrMAC: RequestMetaType;
    getDevices: RequestMetaType;
    createDevice: RequestMetaType;
    updateDevice: RequestMetaType;
    deleteDevice: RequestMetaType;
  };
  devices?: DevicesStateType;
}
