/** @format */
import { MeasurementType } from '@/models/measurement';

export interface MeasurementsSliceStateType {
  measurements: { [id: MeasurementType['id']]: MeasurementType };
}
