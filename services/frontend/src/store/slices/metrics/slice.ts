/** @format */

import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { initialRequestMeta } from '../types';
import {
  createMetric,
  deleteMetric,
  getMetric,
  getMetricByName,
  getMetrics,
  updateMetric,
} from './thunks';
import { MetricsSliceType, MetricType } from './types';

export const initialState: MetricsSliceType = {
  requests: {
    getMetric: initialRequestMeta,
    getMetricByName: initialRequestMeta,
    getMetrics: initialRequestMeta,
    createMetric: initialRequestMeta,
    updateMetric: initialRequestMeta,
    deleteMetric: initialRequestMeta,
  },
  metrics: undefined,
};

export const setMetrics = (state: MetricsSliceType, metrics: MetricType | MetricType[]) => {
  state.metrics = state.metrics || {};
  if (Array.isArray(metrics)) metrics.forEach((metric) => setMetrics(state, metric));
  else state.metrics[metrics.id] = metrics;
};

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<MetricsSliceType>): void => {
    builder
      .addCase(getMetric.pending, (state, action) => {
        state.requests.getMetric.isLoading = true;
        state.requests.getMetric.started = new Date().toISOString();
      })
      .addCase(getMetric.fulfilled, (state, action) => {
        setMetrics(state, action.payload);
        state.requests.getMetric.isLoading = false;
        state.requests.getMetric.finished = new Date().toISOString();
      })
      .addCase(getMetric.rejected, (state, action) => {
        state.requests.getMetric.error = action.payload || action.error;
        state.requests.getMetric.isLoading = false;
        state.requests.getMetric.finished = new Date().toISOString();
      })
      .addCase(getMetricByName.pending, (state, action) => {
        state.requests.getMetricByName.isLoading = true;
        state.requests.getMetricByName.started = new Date().toISOString();
      })
      .addCase(getMetricByName.fulfilled, (state, action) => {
        setMetrics(state, action.payload);
        state.requests.getMetricByName.isLoading = false;
        state.requests.getMetricByName.finished = new Date().toISOString();
      })
      .addCase(getMetricByName.rejected, (state, action) => {
        state.requests.getMetricByName.error = action.payload || action.error;
        state.requests.getMetricByName.isLoading = false;
        state.requests.getMetricByName.finished = new Date().toISOString();
      })
      .addCase(getMetrics.pending, (state, action) => {
        state.requests.getMetrics.isLoading = true;
        state.requests.getMetrics.started = new Date().toISOString();
      })
      .addCase(getMetrics.fulfilled, (state, action) => {
        setMetrics(state, action.payload);
        state.requests.getMetrics.isLoading = false;
        state.requests.getMetrics.finished = new Date().toISOString();
      })
      .addCase(getMetrics.rejected, (state, action) => {
        state.requests.getMetrics.error = action.payload || action.error;
        state.requests.getMetrics.isLoading = false;
        state.requests.getMetrics.finished = new Date().toISOString();
      })
      .addCase(createMetric.pending, (state, action) => {
        state.requests.createMetric.isLoading = true;
        state.requests.createMetric.started = new Date().toISOString();
      })
      .addCase(createMetric.fulfilled, (state, action) => {
        setMetrics(state, action.payload);
        state.requests.createMetric.isLoading = false;
        state.requests.createMetric.finished = new Date().toISOString();
      })
      .addCase(createMetric.rejected, (state, action) => {
        state.requests.createMetric.error = action.payload || action.error;
        state.requests.createMetric.isLoading = false;
        state.requests.createMetric.finished = new Date().toISOString();
      })
      .addCase(updateMetric.pending, (state, action) => {
        state.requests.updateMetric.isLoading = true;
        state.requests.updateMetric.started = new Date().toISOString();
      })
      .addCase(updateMetric.fulfilled, (state, action) => {
        setMetrics(state, action.payload);
        state.requests.updateMetric.isLoading = false;
        state.requests.updateMetric.finished = new Date().toISOString();
      })
      .addCase(updateMetric.rejected, (state, action) => {
        state.requests.updateMetric.error = action.payload || action.error;
        state.requests.updateMetric.isLoading = false;
        state.requests.updateMetric.finished = new Date().toISOString();
      })
      .addCase(deleteMetric.pending, (state, action) => {
        state.requests.deleteMetric.isLoading = true;
        state.requests.deleteMetric.started = new Date().toISOString();
      })
      .addCase(deleteMetric.fulfilled, (state, action) => {
        if (state.metrics) delete state.metrics[action.meta.arg.id];
        state.requests.deleteMetric.isLoading = false;
        state.requests.deleteMetric.finished = new Date().toISOString();
      })
      .addCase(deleteMetric.rejected, (state, action) => {
        state.requests.deleteMetric.error = action.payload || action.error;
        state.requests.deleteMetric.isLoading = false;
        state.requests.deleteMetric.finished = new Date().toISOString();
      });
  },
});
