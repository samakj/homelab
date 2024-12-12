/** @format */
import { MetricType } from '@/models/metric';

export interface MetricsSliceStateType {
  metrics: { [id: MetricType['id']]: MetricType };
}
