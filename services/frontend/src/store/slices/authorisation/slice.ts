/** @format */

import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { authorisationConfig } from '../../../configs/authorisation';
import { forceUTCTimestamp } from '../../../utils';
import { initialRequestMeta } from '../types';
import { checkToken, login, logout } from './thunks';
import { AuthorisationSliceType } from './types';

export const initialState: AuthorisationSliceType = {
  requests: {
    login: initialRequestMeta,
    logout: initialRequestMeta,
    checkToken: initialRequestMeta,
  },
  user: undefined,
  access_token: undefined,
};

export const authorisationSlice = createSlice({
  name: 'authorisation',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AuthorisationSliceType>): void => {
    builder
      .addCase(login.pending, (state, action): void => {
        state.requests.login.isLoading = true;
        state.requests.login.started = new Date().toISOString();
      })
      .addCase(login.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.session = action.payload.session;
        state.session.created = forceUTCTimestamp(state.session.created);
        state.session.expires = forceUTCTimestamp(state.session.expires);
        document.cookie = `${authorisationConfig.cookie}=${action.payload.access_token}`;
        state.requests.login.isLoading = false;
        state.requests.login.finished = new Date().toISOString();
      })
      .addCase(login.rejected, (state, action): void => {
        state.user = undefined;
        state.access_token = undefined;
        state.session = undefined;
        document.cookie = `${authorisationConfig.cookie}=; expires=Sun, 1 Jan 2000 00:00:00 UTC`;
        state.requests.login.error = action.payload || action.error;
        state.requests.login.isLoading = false;
        state.requests.login.finished = new Date().toISOString();
      })
      .addCase(logout.pending, (state, action): void => {
        state.requests.logout.isLoading = true;
        state.requests.logout.started = new Date().toISOString();
      })
      .addCase(logout.fulfilled, (state, action): void => {
        state.user = undefined;
        state.access_token = undefined;
        state.session = undefined;
        document.cookie = `${authorisationConfig.cookie}=; expires=Sun, 1 Jan 2000 00:00:00 UTC`;
        state.requests.logout.isLoading = false;
        state.requests.logout.finished = new Date().toISOString();
      })
      .addCase(logout.rejected, (state, action): void => {
        state.requests.logout.error = action.payload || action.error;
        state.requests.logout.isLoading = false;
        state.requests.logout.finished = new Date().toISOString();
      })
      .addCase(checkToken.pending, (state, action): void => {
        state.requests.checkToken.isLoading = true;
        state.requests.checkToken.started = new Date().toISOString();
      })
      .addCase(checkToken.fulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.session.created = forceUTCTimestamp(state.session.created);
        state.session.expires = forceUTCTimestamp(state.session.expires);
        state.access_token = action.payload.token;
        document.cookie = `${authorisationConfig.cookie}=${action.payload.token}`;
        state.requests.checkToken.isLoading = false;
        state.requests.checkToken.finished = new Date().toISOString();
      })
      .addCase(checkToken.rejected, (state, action): void => {
        state.user = undefined;
        state.session = undefined;
        state.access_token = undefined;
        document.cookie = `${authorisationConfig.cookie}=; expires= Sun, 1 Jan 2000 00:00:00 UTC`;
        state.requests.checkToken.error = action.payload || action.error;
        state.requests.checkToken.isLoading = false;
        state.requests.checkToken.finished = new Date().toISOString();
      });
  },
});
