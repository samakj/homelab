/** @format */
import { PayloadAction } from '@reduxjs/toolkit';

import { SerialisedAxiosResponse } from '@/common/axios/types';
import { MeasurementType } from '@/models/measurement';

import { MeasurementsSliceStateType } from './types';

export const setMeasurement = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<MeasurementType>, 'payload'>
) => {
  state.measurements[action.payload.id] = action.payload;
};

export const setMeasurements = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<MeasurementType[]>, 'payload'>
) => {
  action.payload.forEach((measurement) => setMeasurement(state, { payload: measurement }));
};

export const setMeasurementFromAxiosResponse = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<MeasurementType>>, 'payload'>
) => {
  setMeasurement(state, { payload: action.payload.data });
};

export const setMeasurementsFromAxiosResponse = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<MeasurementType[]>>, 'payload'>
) => {
  setMeasurements(state, { payload: action.payload.data });
};

export const removeMeasurement = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<Pick<MeasurementType, 'id'>>, 'payload'>
) => {
  delete state.measurements[action.payload.id];
};

export const removeMeasurementFromAxiosResponse = (
  state: MeasurementsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<Pick<MeasurementType, 'id'>>>, 'payload'>
) => {
  removeMeasurement(state, { payload: action.payload.data });
};
