/** @format */
import { DeviceType } from '../device';
import { LocationType } from '../location';
import { MetricType } from '../metric';

export interface MeasurementType {
  id: number;
  timestamp: string;
  device_id: DeviceType['id'];
  location_id: LocationType['id'];
  metric_id: MetricType['id'];
  tags?: string[];
  value?: string | number | boolean;
}
