/** @format */

import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { initialRequestMeta } from '../types';
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocationByName,
  getLocations,
  updateLocation,
} from './thunks';
import { LocationsSliceType, LocationType } from './types';

export const initialState: LocationsSliceType = {
  requests: {
    getLocation: initialRequestMeta,
    getLocationByName: initialRequestMeta,
    getLocations: initialRequestMeta,
    createLocation: initialRequestMeta,
    updateLocation: initialRequestMeta,
    deleteLocation: initialRequestMeta,
  },
  locations: undefined,
};

export const setLocations = (
  state: LocationsSliceType,
  locations: LocationType | LocationType[]
) => {
  state.locations = state.locations || {};
  if (Array.isArray(locations)) locations.forEach((location) => setLocations(state, location));
  else state.locations[locations.id] = locations;
};

export const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<LocationsSliceType>): void => {
    builder
      .addCase(getLocation.pending, (state, action) => {
        state.requests.getLocation.isLoading = true;
        state.requests.getLocation.started = new Date().toISOString();
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        setLocations(state, action.payload);
        state.requests.getLocation.isLoading = false;
        state.requests.getLocation.finished = new Date().toISOString();
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.requests.getLocation.error = action.payload || action.error;
        state.requests.getLocation.isLoading = false;
        state.requests.getLocation.finished = new Date().toISOString();
      })
      .addCase(getLocationByName.pending, (state, action) => {
        state.requests.getLocationByName.isLoading = true;
        state.requests.getLocationByName.started = new Date().toISOString();
      })
      .addCase(getLocationByName.fulfilled, (state, action) => {
        setLocations(state, action.payload);
        state.requests.getLocationByName.isLoading = false;
        state.requests.getLocationByName.finished = new Date().toISOString();
      })
      .addCase(getLocationByName.rejected, (state, action) => {
        state.requests.getLocationByName.error = action.payload || action.error;
        state.requests.getLocationByName.isLoading = false;
        state.requests.getLocationByName.finished = new Date().toISOString();
      })
      .addCase(getLocations.pending, (state, action) => {
        state.requests.getLocations.isLoading = true;
        state.requests.getLocations.started = new Date().toISOString();
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        setLocations(state, action.payload);
        state.requests.getLocations.isLoading = false;
        state.requests.getLocations.finished = new Date().toISOString();
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.requests.getLocations.error = action.payload || action.error;
        state.requests.getLocations.isLoading = false;
        state.requests.getLocations.finished = new Date().toISOString();
      })
      .addCase(createLocation.pending, (state, action) => {
        state.requests.createLocation.isLoading = true;
        state.requests.createLocation.started = new Date().toISOString();
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        setLocations(state, action.payload);
        state.requests.createLocation.isLoading = false;
        state.requests.createLocation.finished = new Date().toISOString();
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.requests.createLocation.error = action.payload || action.error;
        state.requests.createLocation.isLoading = false;
        state.requests.createLocation.finished = new Date().toISOString();
      })
      .addCase(updateLocation.pending, (state, action) => {
        state.requests.updateLocation.isLoading = true;
        state.requests.updateLocation.started = new Date().toISOString();
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        setLocations(state, action.payload);
        state.requests.updateLocation.isLoading = false;
        state.requests.updateLocation.finished = new Date().toISOString();
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.requests.updateLocation.error = action.payload || action.error;
        state.requests.updateLocation.isLoading = false;
        state.requests.updateLocation.finished = new Date().toISOString();
      })
      .addCase(deleteLocation.pending, (state, action) => {
        state.requests.deleteLocation.isLoading = true;
        state.requests.deleteLocation.started = new Date().toISOString();
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        if (state.locations) delete state.locations[action.meta.arg.id];
        state.requests.deleteLocation.isLoading = false;
        state.requests.deleteLocation.finished = new Date().toISOString();
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.requests.deleteLocation.error = action.payload || action.error;
        state.requests.deleteLocation.isLoading = false;
        state.requests.deleteLocation.finished = new Date().toISOString();
      });
  },
});
