/** @format */
import { createSlice } from '@reduxjs/toolkit';

import {
  removeDevice,
  removeDeviceFromAxiosResponse,
  setDevice,
  setDeviceFromAxiosResponse,
  setDevices,
  setDevicesFromAxiosResponse,
} from './reducers';
import {
  createDeviceThunk,
  deleteDeviceThunk,
  getDeviceThunk,
  getDevicesThunk,
  updateDeviceThunk,
} from './thunks';
import { DevicesSliceStateType } from './types';

export const initialState: DevicesSliceStateType = { devices: {} };

export const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevice,
    setDevices,
    setDeviceFromAxiosResponse,
    setDevicesFromAxiosResponse,
    removeDevice,
    removeDeviceFromAxiosResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDeviceThunk.fulfilled, setDeviceFromAxiosResponse)
      .addCase(getDeviceThunk.fulfilled, setDeviceFromAxiosResponse)
      .addCase(getDevicesThunk.fulfilled, setDevicesFromAxiosResponse)
      .addCase(updateDeviceThunk.fulfilled, setDeviceFromAxiosResponse)
      .addCase(deleteDeviceThunk.fulfilled, removeDeviceFromAxiosResponse);
  },
});
