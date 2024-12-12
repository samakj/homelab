/** @format */
import { PayloadAction } from '@reduxjs/toolkit';

import { SerialisedAxiosResponse } from '@/common/axios/types';
import { DeviceType } from '@/models/device';

import { DevicesSliceStateType } from './types';

export const setDevice = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<DeviceType>, 'payload'>
) => {
  state.devices[action.payload.id] = action.payload;
};

export const setDevices = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<DeviceType[]>, 'payload'>
) => {
  action.payload.forEach((device) => setDevice(state, { payload: device }));
};

export const setDeviceFromAxiosResponse = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<DeviceType>>, 'payload'>
) => {
  setDevice(state, { payload: action.payload.data });
};

export const setDevicesFromAxiosResponse = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<DeviceType[]>>, 'payload'>
) => {
  setDevices(state, { payload: action.payload.data });
};

export const removeDevice = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<Pick<DeviceType, 'id'>>, 'payload'>
) => {
  delete state.devices[action.payload.id];
};

export const removeDeviceFromAxiosResponse = (
  state: DevicesSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<Pick<DeviceType, 'id'>>>, 'payload'>
) => {
  removeDevice(state, { payload: action.payload.data });
};
