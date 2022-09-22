/** @format */

import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { initialRequestMeta } from '../types';
import {
  createDevice,
  deleteDevice,
  getDevice,
  getDeviceByIPOrMAC,
  getDevices,
  updateDevice,
} from './thunks';
import { DevicesSliceType, DeviceType } from './types';

export const initialState: DevicesSliceType = {
  requests: {
    getDevice: initialRequestMeta,
    getDeviceByIPOrMAC: initialRequestMeta,
    getDevices: initialRequestMeta,
    createDevice: initialRequestMeta,
    updateDevice: initialRequestMeta,
    deleteDevice: initialRequestMeta,
  },
  devices: undefined,
};

export const setDevices = (state: DevicesSliceType, devices: DeviceType | DeviceType[]) => {
  state.devices = state.devices || {};
  if (Array.isArray(devices)) devices.forEach((device) => setDevices(state, device));
  else state.devices[devices.id] = devices;
};

export const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<DevicesSliceType>): void => {
    builder
      .addCase(getDevice.pending, (state, action) => {
        state.requests.getDevice.isLoading = true;
        state.requests.getDevice.started = new Date().toISOString();
      })
      .addCase(getDevice.fulfilled, (state, action) => {
        setDevices(state, action.payload);
        state.requests.getDevice.isLoading = false;
        state.requests.getDevice.finished = new Date().toISOString();
      })
      .addCase(getDevice.rejected, (state, action) => {
        state.requests.getDevice.error = action.payload || action.error;
        state.requests.getDevice.isLoading = false;
        state.requests.getDevice.finished = new Date().toISOString();
      })
      .addCase(getDeviceByIPOrMAC.pending, (state, action) => {
        state.requests.getDeviceByIPOrMAC.isLoading = true;
        state.requests.getDeviceByIPOrMAC.started = new Date().toISOString();
      })
      .addCase(getDeviceByIPOrMAC.fulfilled, (state, action) => {
        setDevices(state, action.payload);
        state.requests.getDeviceByIPOrMAC.isLoading = false;
        state.requests.getDeviceByIPOrMAC.finished = new Date().toISOString();
      })
      .addCase(getDeviceByIPOrMAC.rejected, (state, action) => {
        state.requests.getDeviceByIPOrMAC.error = action.payload || action.error;
        state.requests.getDeviceByIPOrMAC.isLoading = false;
        state.requests.getDeviceByIPOrMAC.finished = new Date().toISOString();
      })
      .addCase(getDevices.pending, (state, action) => {
        state.requests.getDevices.isLoading = true;
        state.requests.getDevices.started = new Date().toISOString();
      })
      .addCase(getDevices.fulfilled, (state, action) => {
        setDevices(state, action.payload);
        state.requests.getDevices.isLoading = false;
        state.requests.getDevices.finished = new Date().toISOString();
      })
      .addCase(getDevices.rejected, (state, action) => {
        state.requests.getDevices.error = action.payload || action.error;
        state.requests.getDevices.isLoading = false;
        state.requests.getDevices.finished = new Date().toISOString();
      })
      .addCase(createDevice.pending, (state, action) => {
        state.requests.createDevice.isLoading = true;
        state.requests.createDevice.started = new Date().toISOString();
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        setDevices(state, action.payload);
        state.requests.createDevice.isLoading = false;
        state.requests.createDevice.finished = new Date().toISOString();
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.requests.createDevice.error = action.payload || action.error;
        state.requests.createDevice.isLoading = false;
        state.requests.createDevice.finished = new Date().toISOString();
      })
      .addCase(updateDevice.pending, (state, action) => {
        state.requests.updateDevice.isLoading = true;
        state.requests.updateDevice.started = new Date().toISOString();
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        setDevices(state, action.payload);
        state.requests.updateDevice.isLoading = false;
        state.requests.updateDevice.finished = new Date().toISOString();
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.requests.updateDevice.error = action.payload || action.error;
        state.requests.updateDevice.isLoading = false;
        state.requests.updateDevice.finished = new Date().toISOString();
      })
      .addCase(deleteDevice.pending, (state, action) => {
        state.requests.deleteDevice.isLoading = true;
        state.requests.deleteDevice.started = new Date().toISOString();
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        if (state.devices) delete state.devices[action.meta.arg.id];
        state.requests.deleteDevice.isLoading = false;
        state.requests.deleteDevice.finished = new Date().toISOString();
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.requests.deleteDevice.error = action.payload || action.error;
        state.requests.deleteDevice.isLoading = false;
        state.requests.deleteDevice.finished = new Date().toISOString();
      });
  },
});
