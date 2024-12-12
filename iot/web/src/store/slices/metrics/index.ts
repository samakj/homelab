/** @format */
import { createSlice } from '@reduxjs/toolkit';

import {
  removeMetric,
  removeMetricFromAxiosResponse,
  setMetric,
  setMetricFromAxiosResponse,
  setMetrics,
  setMetricsFromAxiosResponse,
} from './reducers';
import {
  createMetricThunk,
  deleteMetricThunk,
  getMetricThunk,
  getMetricsThunk,
  updateMetricThunk,
} from './thunks';
import { MetricsSliceStateType } from './types';

export const initialState: MetricsSliceStateType = { metrics: {} };

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setMetric,
    setMetrics,
    setMetricFromAxiosResponse,
    setMetricsFromAxiosResponse,
    removeMetric,
    removeMetricFromAxiosResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMetricThunk.fulfilled, setMetricFromAxiosResponse)
      .addCase(getMetricThunk.fulfilled, setMetricFromAxiosResponse)
      .addCase(getMetricsThunk.fulfilled, setMetricsFromAxiosResponse)
      .addCase(updateMetricThunk.fulfilled, setMetricFromAxiosResponse)
      .addCase(deleteMetricThunk.fulfilled, removeMetricFromAxiosResponse);
  },
});
