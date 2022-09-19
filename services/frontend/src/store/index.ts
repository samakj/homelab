/** @format */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as _useDispatch } from 'react-redux';
import { authorisationSlice } from './slices/authorisation/slice';

export const store = configureStore({
  reducer: {
    authorisation: authorisationSlice.reducer,
  },
  devTools: process.env.ENVIRONMENT === 'dev',
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export const useDispatch = () => _useDispatch<Dispatch>();
