/** @format */
import { MeasurementType } from '@/models/measurement';
import { useSelector } from '@/store';

import { useAsyncThunk } from '../../../common/hooks/thunk';
import {
  createMeasurementThunk,
  deleteMeasurementThunk,
  getMeasurementThunk,
  getMeasurementsThunk,
  updateMeasurementThunk,
} from './thunks';

export const useCreateMeasurement = () =>
  useAsyncThunk({ createMeasurement: createMeasurementThunk });

export const useGetMeasurement = () => useAsyncThunk({ getMeasurement: getMeasurementThunk });

export const useGetMeasurements = () => useAsyncThunk({ getMeasurements: getMeasurementsThunk });

export const useUpdateMeasurement = () =>
  useAsyncThunk({ updateMeasurement: updateMeasurementThunk });

export const useDeleteMeasurement = () =>
  useAsyncThunk({ deleteMeasurement: deleteMeasurementThunk });

export const useMeasurement = (id?: MeasurementType['id']) => {
  const measurement = useSelector((state) =>
    id ? state.measurements.measurements[id] : undefined
  );
  return measurement;
};

export const useMeasurements = () => {
  const measurements = useSelector((state) => state.measurements.measurements);
  return measurements;
};
