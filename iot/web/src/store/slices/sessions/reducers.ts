/** @format */
import { PayloadAction } from '@reduxjs/toolkit';

import { SessionsSliceStateType } from './types';

export const setIsAuthenticated = (
  state: SessionsSliceStateType,
  action: PayloadAction<boolean>
) => {
  state.isAuthenticated = action.payload;
};
