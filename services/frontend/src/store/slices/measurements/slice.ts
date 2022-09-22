/** @format */

import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { initialRequestMeta } from '../types';
import {
  createMeasurement,
  getMeasurement,
  getMeasurementsLatest,
  getMeasurements,
} from './thunks';
import { MeasurementsSliceType, MeasurementType } from './types';

export const initialState: MeasurementsSliceType = {
  requests: {
    getMeasurement: initialRequestMeta,
    getMeasurementsLatest: initialRequestMeta,
    getMeasurements: initialRequestMeta,
    createMeasurement: initialRequestMeta,
  },
  measurements: undefined,
};

export const setMeasurements = (
  state: MeasurementsSliceType,
  measurements: MeasurementType | MeasurementType[]
) => {
  state.measurements = state.measurements || {};
  if (Array.isArray(measurements))
    measurements.forEach((measurement) => setMeasurements(state, measurement));
  else state.measurements[measurements.id] = measurements;
};

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<MeasurementsSliceType>): void => {
    builder
      .addCase(getMeasurement.pending, (state, action) => {
        state.requests.getMeasurement.isLoading = true;
        state.requests.getMeasurement.started = new Date().toISOString();
      })
      .addCase(getMeasurement.fulfilled, (state, action) => {
        setMeasurements(state, action.payload);
        state.requests.getMeasurement.isLoading = false;
        state.requests.getMeasurement.finished = new Date().toISOString();
      })
      .addCase(getMeasurement.rejected, (state, action) => {
        state.requests.getMeasurement.error = action.payload || action.error;
        state.requests.getMeasurement.isLoading = false;
        state.requests.getMeasurement.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.pending, (state, action) => {
        state.requests.getMeasurementsLatest.isLoading = true;
        state.requests.getMeasurementsLatest.started = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.fulfilled, (state, action) => {
        setMeasurements(state, action.payload);
        state.requests.getMeasurementsLatest.isLoading = false;
        state.requests.getMeasurementsLatest.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.rejected, (state, action) => {
        state.requests.getMeasurementsLatest.error = action.payload || action.error;
        state.requests.getMeasurementsLatest.isLoading = false;
        state.requests.getMeasurementsLatest.finished = new Date().toISOString();
      })
      .addCase(getMeasurements.pending, (state, action) => {
        state.requests.getMeasurements.isLoading = true;
        state.requests.getMeasurements.started = new Date().toISOString();
      })
      .addCase(getMeasurements.fulfilled, (state, action) => {
        setMeasurements(state, action.payload);
        state.requests.getMeasurements.isLoading = false;
        state.requests.getMeasurements.finished = new Date().toISOString();
      })
      .addCase(getMeasurements.rejected, (state, action) => {
        state.requests.getMeasurements.error = action.payload || action.error;
        state.requests.getMeasurements.isLoading = false;
        state.requests.getMeasurements.finished = new Date().toISOString();
      })
      .addCase(createMeasurement.pending, (state, action) => {
        state.requests.createMeasurement.isLoading = true;
        state.requests.createMeasurement.started = new Date().toISOString();
      })
      .addCase(createMeasurement.fulfilled, (state, action) => {
        setMeasurements(state, action.payload);
        state.requests.createMeasurement.isLoading = false;
        state.requests.createMeasurement.finished = new Date().toISOString();
      })
      .addCase(createMeasurement.rejected, (state, action) => {
        state.requests.createMeasurement.error = action.payload || action.error;
        state.requests.createMeasurement.isLoading = false;
        state.requests.createMeasurement.finished = new Date().toISOString();
      });
  },
});
