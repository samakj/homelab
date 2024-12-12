/** @format */
import { Any } from '@/@types/any';

import { LocationType } from '../location';
import { MetricType } from '../metric';

export interface DeviceType {
  id: number;
  mac: string;
  ip: string;
  location_id: LocationType['id'];
  last_message?: string;
}

export interface DeviceLogMessageType {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'unknown';
  message: string;
}

export interface DeviceButtonSourceType {
  state?: boolean;
  pin: number;
  id: string;
  type: 'button';
}

export interface DeviceDHTSourceType {
  temperature?: number;
  humidity?: number;
  pin: number;
  id: string;
  type: 'dht';
}

export interface DeviceNeopixelsSourceType {
  colour?: { red: number; green: number; blue: number; white: number };
  pixelColours: { red: number; green: number; blue: number; white: number }[];
  pin: number;
  id: string;
  type: 'neopixel';
}

export interface DeviceNTPSourceType {
  datetime: string;
  id: string;
  isConnected: boolean;
  startTimestamp: string;
  startTimestampOffset: number;
  type: 'ntp';
}

export interface DeviceTEMT6000SourceType {
  lux?: number;
  pin: number;
  id: string;
  type: 'temt6000';
}

export interface DeviceRotaryEncoderSourceType {
  position?: number;
  direction?: -1 | 0 | 1;
  pins: [number, number];
  id: string;
  type: 'rotary-encoder';
}

export interface DeviceWifiSourceType {
  id: string;
  isConnected: boolean;
  strength: string;
  rssi: number;
  type: 'wifi';
}

export type DeviceSourceType =
  | DeviceButtonSourceType
  | DeviceDHTSourceType
  | DeviceNeopixelsSourceType
  | DeviceNTPSourceType
  | DeviceTEMT6000SourceType
  | DeviceRotaryEncoderSourceType
  | DeviceWifiSourceType;

export const isDeviceButtonSourceType = (
  source: DeviceSourceType
): source is DeviceButtonSourceType => source.type == 'button';
export const isDeviceDHTSourceType = (source: DeviceSourceType): source is DeviceDHTSourceType =>
  source.type == 'dht';
export const isDeviceNeopixelsSourceType = (
  source: DeviceSourceType
): source is DeviceNeopixelsSourceType => source.type == 'neopixel';
export const isDeviceNTPSourceType = (source: DeviceSourceType): source is DeviceNTPSourceType =>
  source.type == 'ntp';
export const isDeviceTEMT6000SourceType = (
  source: DeviceSourceType
): source is DeviceTEMT6000SourceType => source.type == 'temt6000';
export const isDeviceRotaryEncoderSourceType = (
  source: DeviceSourceType
): source is DeviceRotaryEncoderSourceType => source.type == 'rotary-encoder';
export const isDeviceWifiSourceType = (source: DeviceSourceType): source is DeviceWifiSourceType =>
  source.type == 'wifi';
