/** @format */

import {
  LatestMeasurementsStateType,
  MeasurementsStateType,
  MeasurementType,
} from '../../store/slices/measurements/types';
import { LocationsStateType } from '../../store/slices/locations/types';
import { ModalPropsType } from '../modal/types';
import { DevicesStateType } from '../../store/slices/devices/types';
import { MetricsStateType } from '../../store/slices/metrics/types';

export interface MeasurementsTablePropsType {
  measurements?: MeasurementsStateType;
  latestMeasurements?: LatestMeasurementsStateType;
  devices?: DevicesStateType;
  locations?: LocationsStateType;
  metrics?: MetricsStateType;
}

export interface DeleteModalPropsType {
  measurementId?: MeasurementType['id'];
  close?: ModalPropsType['close'];
}

export interface EditModalPropsType {
  measurementId?: MeasurementType['id'];
  close?: ModalPropsType['close'];
}

export interface CreateModalPropsType {
  close?: ModalPropsType['close'];
  isOpen?: ModalPropsType['isOpen'];
}

export interface MeasurementsTableRowType {
  locationsSpan: number;
  metricsSpan: number;
  tagsSpan: number;
  metricIndex: number;
  tagsIndex: number;
  deviceIndex: number;
  measurementId: number;
}
