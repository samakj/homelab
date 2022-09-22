/** @format */

import { RequestMetaType } from '../types';
import { LocationType } from '../locations/types';
import { MetricType } from '../metrics/types';
import { DeviceType } from '../devices/types';

export enum ValueTypeEnum {
  STRING = 'string',
  FLOAT = 'float',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
}

export type MeasurementType<VT extends ValueTypeEnum = ValueTypeEnum> = {
  id: number;
  timestamp: string;
  device_id: DeviceType['id'];
  location_id: LocationType['id'];
  metric_id: MetricType['id'];
  tags: string[];
} & (VT extends ValueTypeEnum.BOOLEAN
  ? { value_type: VT; value: boolean }
  : VT extends ValueTypeEnum.FLOAT
  ? { value_type: VT; value: number }
  : VT extends ValueTypeEnum.INTEGER
  ? { value_type: VT; value: number }
  : VT extends ValueTypeEnum.STRING
  ? { value_type: VT; value: string }
  : { value_type: VT; value: string | number | boolean });

export const isStringMeasurementType = (
  measurement: MeasurementType
): measurement is MeasurementType<ValueTypeEnum.STRING> =>
  measurement.value_type === ValueTypeEnum.STRING;

export const isFloatMeasurementType = (
  measurement: MeasurementType
): measurement is MeasurementType<ValueTypeEnum.FLOAT> =>
  measurement.value_type === ValueTypeEnum.FLOAT;

export const isIntegerMeasurementType = (
  measurement: MeasurementType
): measurement is MeasurementType<ValueTypeEnum.INTEGER> =>
  measurement.value_type === ValueTypeEnum.INTEGER;

export const isBooleanMeasurementType = (
  measurement: MeasurementType
): measurement is MeasurementType<ValueTypeEnum.BOOLEAN> =>
  measurement.value_type === ValueTypeEnum.BOOLEAN;

export interface MeasurementUrlPathParamsType {
  id: MeasurementType['id'];
}

export interface MeasurementUrlParamsType {
  access_token: string;
}

export interface MeasurementsUrlParamsType {
  access_token: string;
  id?: MeasurementType['id'] | MeasurementType['id'][];
  device_id?: MeasurementType['device_id'] | MeasurementType['device_id'][];
  metric_id?: MeasurementType['metric_id'] | MeasurementType['metric_id'][];
  location_id?: MeasurementType['location_id'] | MeasurementType['location_id'][];
  tags?: MeasurementType['tags'] | MeasurementType['tags'][];
  timestamp_gte?: MeasurementType['timestamp'];
  timestamp_lte?: MeasurementType['timestamp'];
  value_gte?: MeasurementType['value'];
  value_lte?: MeasurementType['value'];
  value?: MeasurementType['value'];
}

export interface MeasurementsLatestUrlParamsType {
  access_token: string;
  id?: MeasurementType['id'] | MeasurementType['id'][];
  device_id?: MeasurementType['device_id'] | MeasurementType['device_id'][];
  metric_id?: MeasurementType['metric_id'] | MeasurementType['metric_id'][];
  location_id?: MeasurementType['location_id'] | MeasurementType['location_id'][];
  tags?: MeasurementType['tags'] | MeasurementType['tags'][];
}

export interface GetMeasurementParamsType
  extends MeasurementUrlPathParamsType,
    MeasurementUrlParamsType {}

export type GetMeasurementResponseType = MeasurementType;

export interface GetMeasurementsParamsType extends MeasurementsUrlParamsType {}

export type GetMeasurementsResponseType = MeasurementType[];

export interface GetMeasurementsLatestParamsType extends MeasurementsLatestUrlParamsType {}

export type GetMeasurementsLatestResponseType = MeasurementType[];

export interface CreateMeasurementParamsType extends MeasurementsUrlParamsType {
  measurement: Omit<MeasurementType, 'id'>;
}

export type CreateMeasurementResponseType = MeasurementType;

export interface MeasurementsStateType {
  [measurementId: number]: MeasurementType;
}

export interface MeasurementsSliceType {
  requests: {
    getMeasurement: RequestMetaType;
    getMeasurementsLatest: RequestMetaType;
    getMeasurements: RequestMetaType;
    createMeasurement: RequestMetaType;
  };
  measurements?: MeasurementsStateType;
}
