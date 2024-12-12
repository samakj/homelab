/** @format */
import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useWeaklyTypedDispatch,
  useSelector as useWeaklyTypedSelector,
} from 'react-redux';

import { devicesSlice } from './slices/devices';
import { locationsSlice } from './slices/locations';
import { measurementsSlice } from './slices/measurements';
import { metricsSlice } from './slices/metrics';
import { sessionsSlice } from './slices/sessions';

export const store = configureStore({
  reducer: {
    devices: devicesSlice.reducer,
    locations: locationsSlice.reducer,
    measurements: measurementsSlice.reducer,
    metrics: metricsSlice.reducer,
    sessions: sessionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useDispatch: () => Dispatch = useWeaklyTypedDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useWeaklyTypedSelector;
