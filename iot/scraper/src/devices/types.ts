/** @format */
import { RouterDeviceType } from '@/router/types';

import { Device } from './device';
import { DeviceWebsocket } from './websocket';

/** @format */
export interface ScrapedDeviceType extends RouterDeviceType {
  ssid: string;
  strength: string;
  datetime: string;
  startTimestamp: string;
  startTimestampOffset: number;
}

export interface ScrapedDevicesType {
  [mac: string]: ScrapedDeviceType;
}

export interface DeviceWebsocketsType {
  [mac: string]: DeviceWebsocket;
}

export interface DevicesType {
  [mac: string]: Device;
}
