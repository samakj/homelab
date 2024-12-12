/** @format */

export interface RouterDeviceType {
  mac: string;
  ip: string;
}

export interface RouterDevicesType {
  [mac: string]: RouterDeviceType;
}

export interface RouterConnectedDeviceType {
  mac: string;
  timestamp: string;
  speed: number;
}

export interface RouterConnectedDevicesType {
  [mac: string]: RouterConnectedDeviceType;
}
