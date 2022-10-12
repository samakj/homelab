/** @format */

import { DeviceType } from '../devices/types';
import { RequestMetaType, WebsocketMessageActionsEnum, WebsocketMessageType } from '../types';

export interface WatchedDeviceType {
  url: string;
  opened?: string;
  closed?: string;
  last_message?: string;
  message_count: number;
  first_connect?: string;
  reconnect_count: number;
  auto_reconnect: boolean;
  reconnect_delay: number;
  connection_error?: string;
  listen_error?: string;
}

export interface WatchedDevicesUrlParamsType {
  access_token: string;
}

export interface GetWatchedDevicesParamsType extends WatchedDevicesUrlParamsType {}

export interface GetWatchedDevicesResponseType {
  measurements: { [deviceId: number]: WatchedDeviceType };
  logs: { [deviceId: number]: WatchedDeviceType };
}

export interface WatchDeviceMeasurementsUrlPathParamsType {
  id: DeviceType['id'];
}

export interface WatchDeviceMeasurementsUrlParamsType {
  access_token: string;
}

export interface WatchDeviceMeasurementsParamsType
  extends WatchDeviceMeasurementsUrlPathParamsType,
    WatchDeviceMeasurementsUrlParamsType {}

export type WatchDeviceMeasurementsResponseType = WatchedDeviceType;

export interface UnwatchDeviceMeasurementsParamsType
  extends WatchDeviceMeasurementsUrlPathParamsType,
    WatchDeviceMeasurementsUrlParamsType {}

export type UnwatchDeviceMeasurementsResponseType = WatchedDeviceType;

export interface UpdateWatchedDevicesWebsocketMessageType
  extends WebsocketMessageType<
    'devices',
    'devices',
    GetWatchedDevicesResponseType,
    WebsocketMessageActionsEnum.UPDATE
  > {}

export interface WatchedDevicesWebsocketUrlParamsType {
  access_token: string;
}

export type WatchedDevicesWebsocketMessageType = UpdateWatchedDevicesWebsocketMessageType;

export const isUpdateWatchedDevicesWebsocketMessageType = (
  message: WatchedDevicesWebsocketMessageType
): message is UpdateWatchedDevicesWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.UPDATE;

export interface UseWatchedDevicesWebsocketPropsType {
  onOpen?: (event: Event, websocket: WebSocket | null) => void;
  onMessage?: (
    event: MessageEvent<string>,
    data: WatchedDevicesWebsocketMessageType,
    websocket: WebSocket | null
  ) => void;
  onError?: (event: Event, websocket: WebSocket | null) => void;
  onClose?: (event: CloseEvent, websocket: WebSocket | null) => void;
  access_token?: string;
}

export interface WatchedDeviceMesurementsState {
  [deviceId: number]: WatchedDeviceType;
}

export interface WatchedDeviceLogsState {
  [deviceId: number]: WatchedDeviceType;
}

export interface WatchedDeviceSliceType {
  requests: {
    getWatchedDevices: RequestMetaType;
    watchDeviceMeasurements: RequestMetaType;
    unwatchDeviceMeasurements: RequestMetaType;
  };
  measurements?: WatchedDeviceMesurementsState;
  logs?: WatchedDeviceLogsState;
}
