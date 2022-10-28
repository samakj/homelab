/** @format */

import { DevicesStateType } from '../../store/slices/devices/types';
import { LocationsStateType } from '../../store/slices/locations/types';
import {
  MeasurementType,
  ValueTypeEnum,
  MeasurementsChartType,
  MeasurementsChartLinePointType,
} from '../../store/slices/measurements/types';
import { ExtendedSet } from '../../utils/set';
import { MetricsStateType } from '../../store/slices/metrics/types';

export interface MeasurementChartPropsType {
  locationIds?: ExtendedSet<MeasurementType['location_id']>;
  setLocationIds?: (ids: ExtendedSet<MeasurementType['location_id']>) => void;
  metricIds?: ExtendedSet<MeasurementType['metric_id']>;
  setMetricIds?: (ids: ExtendedSet<MeasurementType['metric_id']>) => void;
  deviceIds?: ExtendedSet<MeasurementType['device_id']>;
  setDeviceIds?: (ids: ExtendedSet<MeasurementType['device_id']>) => void;
  tags?: ExtendedSet<MeasurementType['tags'][number]>;
  setTags?: (tags: ExtendedSet<MeasurementType['tags'][number]>) => void;
  from?: Date;
  setFrom?: (date?: Date) => void;
  to?: Date;
  setTo?: (date?: Date) => void;
  autoReload?: boolean;
  setAutoReload?: (autoReload?: boolean) => void;
  measurementsChart?: MeasurementsChartType;
  locations?: LocationsStateType;
  devices?: DevicesStateType;
  metrics?: MetricsStateType;
  filters?: boolean;
  yAxisPadding?: number;
}

export interface LinesType {
  [lineKey: string]: MeasurementType<ValueTypeEnum.FLOAT | ValueTypeEnum.INTEGER>[];
}
export interface NearestPointsType {
  [lineKey: string]: {
    above?: MeasurementsChartLinePointType & {
      position: 'above' | 'below';
      line: string;
    };
    below?: MeasurementsChartLinePointType & {
      position: 'above' | 'below';
      line: string;
    };
  };
}
