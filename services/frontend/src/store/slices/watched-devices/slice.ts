/** @format */

import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialRequestMeta } from '../types';
import { getWatchedDevices, unwatchDeviceMeasurements, watchDeviceMeasurements } from './thunks';
import { WatchedDeviceSliceType, GetWatchedDevicesResponseType } from './types';
import { UpdateWatchedDevicesMessageAction } from './websocket';

export const initialState: WatchedDeviceSliceType = {
  requests: {
    getWatchedDevices: initialRequestMeta,
    watchDeviceMeasurements: initialRequestMeta,
    unwatchDeviceMeasurements: initialRequestMeta,
  },
  measurements: undefined,
  logs: undefined,
};

export const setWatchedDevices = (
  state: WatchedDeviceSliceType,
  action: Pick<PayloadAction<GetWatchedDevicesResponseType>, 'payload'>
) => {
  state.measurements = action.payload.measurements;
  state.logs = action.payload.logs;
};

export const watchedDevicesSlice = createSlice({
  name: 'watchedDevices',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<WatchedDeviceSliceType>): void => {
    builder
      .addCase(getWatchedDevices.pending, (state, action) => {
        state.requests.getWatchedDevices.isLoading = true;
        state.requests.getWatchedDevices.started = new Date().toISOString();
      })
      .addCase(getWatchedDevices.fulfilled, (state, action) => {
        setWatchedDevices(state, action);
        state.requests.getWatchedDevices.isLoading = false;
        state.requests.getWatchedDevices.finished = new Date().toISOString();
      })
      .addCase(getWatchedDevices.rejected, (state, action) => {
        state.requests.getWatchedDevices.error = action.payload || action.error;
        state.requests.getWatchedDevices.isLoading = false;
        state.requests.getWatchedDevices.finished = new Date().toISOString();
      })
      .addCase(watchDeviceMeasurements.pending, (state, action) => {
        state.requests.watchDeviceMeasurements.isLoading = true;
        state.requests.watchDeviceMeasurements.started = new Date().toISOString();
      })
      .addCase(watchDeviceMeasurements.fulfilled, (state, action) => {
        state.requests.watchDeviceMeasurements.isLoading = false;
        state.requests.watchDeviceMeasurements.finished = new Date().toISOString();
      })
      .addCase(watchDeviceMeasurements.rejected, (state, action) => {
        state.requests.watchDeviceMeasurements.error = action.payload || action.error;
        state.requests.watchDeviceMeasurements.isLoading = false;
        state.requests.watchDeviceMeasurements.finished = new Date().toISOString();
      })
      .addCase(unwatchDeviceMeasurements.pending, (state, action) => {
        state.requests.unwatchDeviceMeasurements.isLoading = true;
        state.requests.unwatchDeviceMeasurements.started = new Date().toISOString();
      })
      .addCase(unwatchDeviceMeasurements.fulfilled, (state, action) => {
        state.requests.unwatchDeviceMeasurements.isLoading = false;
        state.requests.unwatchDeviceMeasurements.finished = new Date().toISOString();
      })
      .addCase(unwatchDeviceMeasurements.rejected, (state, action) => {
        state.requests.unwatchDeviceMeasurements.error = action.payload || action.error;
        state.requests.unwatchDeviceMeasurements.isLoading = false;
        state.requests.unwatchDeviceMeasurements.finished = new Date().toISOString();
      })
      .addCase(UpdateWatchedDevicesMessageAction, (state, action) => {
        setWatchedDevices(state, { payload: action.payload.devices });
      });
  },
});
