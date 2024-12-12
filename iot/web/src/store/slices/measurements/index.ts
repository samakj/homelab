/** @format */
import { createSlice } from '@reduxjs/toolkit';

import {
  removeMeasurement,
  removeMeasurementFromAxiosResponse,
  setMeasurement,
  setMeasurementFromAxiosResponse,
  setMeasurements,
  setMeasurementsFromAxiosResponse,
} from './reducers';
import {
  createMeasurementThunk,
  deleteMeasurementThunk,
  getMeasurementThunk,
  getMeasurementsThunk,
  updateMeasurementThunk,
} from './thunks';
import { MeasurementsSliceStateType } from './types';

export const initialState: MeasurementsSliceStateType = { measurements: {} };

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    setMeasurement,
    setMeasurements,
    setMeasurementFromAxiosResponse,
    setMeasurementsFromAxiosResponse,
    removeMeasurement,
    removeMeasurementFromAxiosResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeasurementThunk.fulfilled, setMeasurementFromAxiosResponse)
      .addCase(getMeasurementThunk.fulfilled, setMeasurementFromAxiosResponse)
      .addCase(getMeasurementsThunk.fulfilled, setMeasurementsFromAxiosResponse)
      .addCase(updateMeasurementThunk.fulfilled, setMeasurementFromAxiosResponse)
      .addCase(deleteMeasurementThunk.fulfilled, removeMeasurementFromAxiosResponse);
  },
});
