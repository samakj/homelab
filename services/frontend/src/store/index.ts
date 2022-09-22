/** @format */

import { configureStore } from '@reduxjs/toolkit';
import { EqualityFn, useDispatch as _useDispatch, useSelector as _useSelector } from 'react-redux';
import { isClient } from '../utils';
import { authorisationSlice } from './slices/authorisation/slice';
import { devicesSlice } from './slices/devices/slice';
import { locationsSlice } from './slices/locations/slice';
import { measurementsSlice } from './slices/measurements/slice';
import { metricsSlice } from './slices/metrics/slice';

export const store = configureStore({
  reducer: {
    authorisation: authorisationSlice.reducer,
    devices: devicesSlice.reducer,
    locations: locationsSlice.reducer,
    metrics: metricsSlice.reducer,
    measurements: measurementsSlice.reducer,
  },
  preloadedState: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export const useDispatch = () => _useDispatch<Dispatch>();
export const useSelector = <Selected = unknown>(
  selector: (state: RootState) => Selected,
  equalityFn?: EqualityFn<Selected> | undefined
) =>
  isClient() ? _useSelector<RootState, Selected>(selector, equalityFn) : selector(store.getState());
