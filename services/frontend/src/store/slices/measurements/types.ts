/** @format */

import { RequestMetaType, WebsocketMessageActionsEnum, WebsocketMessageType } from '../types';
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

export interface DevicesWebsocketUrlParamsType {
  access_token: string;
}

export interface CreateMeasurementWebsocketMessageType
  extends WebsocketMessageType<
    'measurement',
    'measurement',
    MeasurementType,
    WebsocketMessageActionsEnum.CREATE
  > {}

export interface UpdateMeasurementWebsocketMessageType
  extends WebsocketMessageType<
    'measurement',
    'measurement' | 'oldMeasurement',
    MeasurementType,
    WebsocketMessageActionsEnum.UPDATE
  > {}

export interface DeleteMeasurementWebsocketMessageType
  extends WebsocketMessageType<
    'measurement',
    'measurement',
    Pick<MeasurementType, 'id'>,
    WebsocketMessageActionsEnum.DELETE
  > {}

export type MeasurementWebsocketMessageType =
  | CreateMeasurementWebsocketMessageType
  | UpdateMeasurementWebsocketMessageType
  | DeleteMeasurementWebsocketMessageType;

export const isCreateMeasurementWebsocketMessageType = (
  message: MeasurementWebsocketMessageType
): message is CreateMeasurementWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.CREATE;

export const isUpdateMeasurementWebsocketMessageType = (
  message: MeasurementWebsocketMessageType
): message is UpdateMeasurementWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.UPDATE;

export const isDeleteMeasurementWebsocketMessageType = (
  message: MeasurementWebsocketMessageType
): message is DeleteMeasurementWebsocketMessageType =>
  message.action === WebsocketMessageActionsEnum.DELETE;

export interface UseMeasurementsWebsocketPropsType {
  onOpen?: (event: Event, websocket: WebSocket | null) => void;
  onMessage?: (
    event: MessageEvent<string>,
    data: MeasurementWebsocketMessageType,
    websocket: WebSocket | null
  ) => void;
  onError?: (event: Event, websocket: WebSocket | null) => void;
  onClose?: (event: CloseEvent, websocket: WebSocket | null) => void;
  access_token?: string;
}

export interface MeasurementsStateType {
  [measurementId: number]: MeasurementType;
}

export interface LatestMeasurementsStateType {
  [locationId: string | number]: {
    count: number;
    children: {
      [metricId: string | number]: {
        count: number;
        children: {
          [tags: string]: {
            count: number;
            children: { [deviceId: string | number]: MeasurementType['id'] };
          };
        };
      };
    };
  };
}

export interface MeasurementsSliceType {
  requests: {
    getMeasurement: RequestMetaType;
    getMeasurementsLatest: RequestMetaType;
    getMeasurements: RequestMetaType;
    createMeasurement: RequestMetaType;
  };
  latest?: LatestMeasurementsStateType;
  measurements?: MeasurementsStateType;
}
