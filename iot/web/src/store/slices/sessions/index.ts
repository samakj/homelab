/** @format */
import { createSlice } from '@reduxjs/toolkit';

import { setIsAuthenticated } from './reducers';
import { SessionsSliceStateType } from './types';

const initialState: SessionsSliceStateType = {
  isAuthenticated: false,
};

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: { setIsAuthenticated },
});
