/** @format */
import { MeasurementType } from '@/models/measurement';

export type MeasurementDBType = Omit<MeasurementType, 'value'> & {
  value: Pick<MeasurementType, 'value'>;
};
