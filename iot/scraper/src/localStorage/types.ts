/** @format */
import { DeviceWebsocketsType, DevicesType, ScrapedDevicesType } from '@/devices/types';
import { RouterConnectedDevicesType, RouterDevicesType } from '@/router/types';

export interface LocalStorageType {
  routerDevices: RouterDevicesType;
  routerConnectedDevices: RouterConnectedDevicesType;
  scrapedDevices: ScrapedDevicesType;
  deviceWebsockets: DeviceWebsocketsType;
  devices: DevicesType;
}
