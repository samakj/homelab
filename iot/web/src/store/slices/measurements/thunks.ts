/** @format */
import {
  createMeasurement,
  deleteMeasurement,
  getMeasurement,
  getMeasurements,
  updateMeasurement,
} from '@/apis/iot/measurements';
import { createAxiosThunk } from '@/common/thunks';

export const createMeasurementThunk = createAxiosThunk(
  'measurements/createMeasurement',
  createMeasurement
);

export const getMeasurementThunk = createAxiosThunk('measurements/getMeasurement', getMeasurement);

export const getMeasurementsThunk = createAxiosThunk(
  'measurements/getMeasurements',
  getMeasurements
);

export const updateMeasurementThunk = createAxiosThunk(
  'measurements/updateMeasurement',
  updateMeasurement
);

export const deleteMeasurementThunk = createAxiosThunk(
  'measurements/deleteMeasurement',
  deleteMeasurement
);
