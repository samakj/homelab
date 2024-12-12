/** @format */
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  createMetric,
  deleteMetric,
  getMetric,
  getMetrics,
  updateMetric,
} from '@/apis/iot/metrics';
import { createAxiosThunk } from '@/common/thunks';

export const createMetricThunk = createAxiosThunk('metrics/createMetric', createMetric);

export const getMetricThunk = createAxiosThunk('metrics/getMetric', getMetric);

export const getMetricsThunk = createAxiosThunk('metrics/getMetrics', getMetrics);

export const updateMetricThunk = createAxiosThunk('metrics/updateMetric', updateMetric);
export const updateMetricThunk2 = createAsyncThunk('metrics/updateMetric', updateMetric);

export const deleteMetricThunk = createAxiosThunk('metrics/deleteMetric', deleteMetric);
