/** @format */
import {
  createDevice,
  deleteDevice,
  getDevice,
  getDevices,
  updateDevice,
} from '@/apis/iot/devices';
import { createAxiosThunk } from '@/common/thunks';

export const createDeviceThunk = createAxiosThunk('devices/createDevice', createDevice);

export const getDeviceThunk = createAxiosThunk('devices/getDevice', getDevice);

export const getDevicesThunk = createAxiosThunk('devices/getDevices', getDevices);

export const updateDeviceThunk = createAxiosThunk('devices/updateDevice', updateDevice);

export const deleteDeviceThunk = createAxiosThunk('devices/deleteDevice', deleteDevice);
