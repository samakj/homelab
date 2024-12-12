/** @format */
import { createSlice } from '@reduxjs/toolkit';

import {
  removeLocation,
  removeLocationFromAxiosResponse,
  setLocation,
  setLocationFromAxiosResponse,
  setLocations,
  setLocationsFromAxiosResponse,
} from './reducers';
import {
  createLocationThunk,
  deleteLocationThunk,
  getLocationThunk,
  getLocationsThunk,
  updateLocationThunk,
} from './thunks';
import { LocationsSliceStateType } from './types';

export const initialState: LocationsSliceStateType = { locations: {} };

export const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocation,
    setLocations,
    setLocationFromAxiosResponse,
    setLocationsFromAxiosResponse,
    removeLocation,
    removeLocationFromAxiosResponse,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLocationThunk.fulfilled, setLocationFromAxiosResponse)
      .addCase(getLocationThunk.fulfilled, setLocationFromAxiosResponse)
      .addCase(getLocationsThunk.fulfilled, setLocationsFromAxiosResponse)
      .addCase(updateLocationThunk.fulfilled, setLocationFromAxiosResponse)
      .addCase(deleteLocationThunk.fulfilled, removeLocationFromAxiosResponse);
  },
});
