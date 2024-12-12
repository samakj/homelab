/** @format */
import { PayloadAction } from '@reduxjs/toolkit';

import { SerialisedAxiosResponse } from '@/common/axios/types';
import { MetricType } from '@/models/metric';
import { Any } from '@/types';

import { MetricsSliceStateType } from './types';

export const setMetric = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<MetricType>, 'payload'>
) => {
  state.metrics[action.payload.id] = action.payload;
};

export const setMetrics = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<MetricType[]>, 'payload'>
) => {
  action.payload.forEach((metric) => setMetric(state, { payload: metric }));
};

export const setMetricFromAxiosResponse = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<MetricType, Any>>, 'payload'>
) => {
  setMetric(state, { payload: action.payload.data });
};

export const setMetricsFromAxiosResponse = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<MetricType[], Any>>, 'payload'>
) => {
  setMetrics(state, { payload: action.payload.data });
};

export const removeMetric = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<Pick<MetricType, 'id'>, Any>, 'payload'>
) => {
  delete state.metrics[action.payload.id];
};

export const removeMetricFromAxiosResponse = (
  state: MetricsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<Pick<MetricType, 'id'>, Any>>, 'payload'>
) => {
  removeMetric(state, { payload: action.payload.data });
};
