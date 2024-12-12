/** @format */
import { DeviceType } from '@/models/device';
import { useSelector } from '@/store';

import { useAsyncThunk } from '../../../common/hooks/thunk';
import {
  createDeviceThunk,
  deleteDeviceThunk,
  getDeviceThunk,
  getDevicesThunk,
  updateDeviceThunk,
} from './thunks';

export const useCreateDevice = () => useAsyncThunk({ createDevice: createDeviceThunk });

export const useGetDevice = () => useAsyncThunk({ getDevice: getDeviceThunk });

export const useGetDevices = () => useAsyncThunk({ getDevices: getDevicesThunk });

export const useUpdateDevice = () => useAsyncThunk({ updateDevice: updateDeviceThunk });

export const useDeleteDevice = () => useAsyncThunk({ deleteDevice: deleteDeviceThunk });

export const useDevice = (id?: DeviceType['id']) => {
  const device = useSelector((state) => (id ? state.devices.devices[id] : undefined));
  return device;
};

export const useDevices = () => {
  const devices = useSelector((state) => state.devices.devices);
  return devices;
};
