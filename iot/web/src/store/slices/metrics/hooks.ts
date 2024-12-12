/** @format */
import { MetricType } from '@/models/metric';
import { useSelector } from '@/store';

import { useAsyncThunk } from '../../../common/hooks/thunk';
import {
  createMetricThunk,
  deleteMetricThunk,
  getMetricThunk,
  getMetricsThunk,
  updateMetricThunk,
} from './thunks';

export const useCreateMetric = () => useAsyncThunk({ createMetric: createMetricThunk });

export const useGetMetric = () => useAsyncThunk({ getMetric: getMetricThunk });

export const useGetMetrics = () => useAsyncThunk({ getMetrics: getMetricsThunk });

export const useUpdateMetric = () => useAsyncThunk({ updateMetric: updateMetricThunk });

export const useDeleteMetric = () => useAsyncThunk({ deleteMetric: deleteMetricThunk });

export const useMetric = (id?: MetricType['id']) => {
  const metric = useSelector((state) => (id ? state.metrics.metrics[id] : undefined));
  return metric;
};

export const useMetricByName = (name?: MetricType['name']) => {
  const metric = useSelector((state) =>
    Object.values(state.metrics.metrics).find((metric) => metric.name === name)
  );
  return metric;
};

export const useMetrics = () => {
  const metrics = useSelector((state) => state.metrics.metrics);
  return metrics;
};
