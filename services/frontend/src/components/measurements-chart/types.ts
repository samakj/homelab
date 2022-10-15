/** @format */

import { DevicesStateType } from '../../store/slices/devices/types';
import { LocationsStateType } from '../../store/slices/locations/types';
import {
  MeasurementsStateType,
  MeasurementType,
  ValueTypeEnum,
} from '../../store/slices/measurements/types';
import { MetricsStateType } from '../../store/slices/metrics/types';
import { ExtendedSet } from '../../utils/set';
import { ScaleLinear, ScaleTime } from 'd3-scale';

export interface MeasurementChartPropsType {
  locationIds: ExtendedSet<MeasurementType['location_id']>;
  setLocationIds: (ids: ExtendedSet<MeasurementType['location_id']>) => void;
  metricIds: ExtendedSet<MeasurementType['metric_id']>;
  setMetricIds: (ids: ExtendedSet<MeasurementType['metric_id']>) => void;
  deviceIds: ExtendedSet<MeasurementType['device_id']>;
  setDeviceIds: (ids: ExtendedSet<MeasurementType['device_id']>) => void;
  tags: ExtendedSet<MeasurementType['tags'][number]>;
  setTags: (tags: ExtendedSet<MeasurementType['tags'][number]>) => void;
  from?: Date;
  setFrom: (date?: Date) => void;
  to?: Date;
  setTo: (date?: Date) => void;
  measurements?: MeasurementsStateType;
  locations?: LocationsStateType;
  devices?: DevicesStateType;
  metrics?: MetricsStateType;
  filters?: boolean;
}

export interface LinesType {
  [lineKey: string]: MeasurementType<ValueTypeEnum.FLOAT | ValueTypeEnum.INTEGER>[];
}
export interface NearestPointsType {
  [lineKey: string]: {
    above?: MeasurementType<ValueTypeEnum.FLOAT | ValueTypeEnum.INTEGER> & {
      position: 'above' | 'below';
    };
    below?: MeasurementType<ValueTypeEnum.FLOAT | ValueTypeEnum.INTEGER> & {
      position: 'above' | 'below';
    };
  };
}

export type NumericRange = [min: number, max: number];

export interface MetricRangesType {
  [metricId: number]: NumericRange;
}

export interface MetricScalesType {
  [metricId: number]: ScaleLinear<number, number>;
}

export interface RangesType {
  dateRange: NumericRange;
  metricRanges: MetricRangesType;
}

export interface ScalesType {
  dateRange: ScaleTime<number, number>;
  metricRanges: MetricScalesType;
}
