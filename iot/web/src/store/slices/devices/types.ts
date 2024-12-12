/** @format */
import { DeviceType } from '@/models/device';

export interface DevicesSliceStateType {
  devices: { [id: DeviceType['id']]: DeviceType };
}
