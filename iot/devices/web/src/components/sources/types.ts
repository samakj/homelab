/** @format */

export interface SourcesPropsType {
  setModalSourceId: (modalSourceId: string) => void;
  setModalType: (modalType: string) => void;
  content: 'logs' | 'docs';
  setContent: (content: 'logs' | 'docs') => void;
}

export interface DeviceButtonSourcePropsType {
  source: DeviceButtonSourceType;
}
export interface DeviceDHTSourcePropsType {
  source: DeviceDHTSourceType;
}
export interface DeviceIRSenderSourcePropsType {
  source: DeviceIRSenderSourceType;
  setModalSourceId: (modalSourceId: string) => void;
  setModalType: (modalType: string) => void;
}
export interface DeviceNeopixelsSourcePropsType {
  source: DeviceNeopixelsSourceType;
  setModalSourceId: (modalSourceId: string) => void;
  setModalType: (modalType: string) => void;
}
export interface DeviceNTPSourcePropsType {
  source: DeviceNTPSourceType;
}
export interface DeviceTEMT6000SourcePropsType {
  source: DeviceTEMT6000SourceType;
}
export interface DeviceRotaryEncoderSourcePropsType {
  source: DeviceRotaryEncoderSourceType;
}
export interface DeviceWifiSourcePropsType {
  source: DeviceWifiSourceType;
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

export interface DeviceIRSenderSourceType {
  pin: number;
  id: string;
  type: 'ir-send';
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
  strength: 'excellent' | 'good' | 'medium' | 'weak' | 'minimal';
  rssi: number;
  type: 'wifi';
}

export type DeviceSourceType =
  | DeviceButtonSourceType
  | DeviceDHTSourceType
  | DeviceIRSenderSourceType
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
export const isDeviceIRSenderourceType = (
  source: DeviceSourceType
): source is DeviceIRSenderSourceType => source.type == 'ir-send';
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
