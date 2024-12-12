/** @format */
import { PayloadAction } from '@reduxjs/toolkit';

import { SerialisedAxiosResponse } from '@/common/axios/types';
import { LocationType } from '@/models/location';

import { LocationsSliceStateType } from './types';

export const setLocation = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<LocationType>, 'payload'>
) => {
  state.locations[action.payload.id] = action.payload;
};

export const setLocations = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<LocationType[]>, 'payload'>
) => {
  action.payload.forEach((location) => setLocation(state, { payload: location }));
};

export const setLocationFromAxiosResponse = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<LocationType>>, 'payload'>
) => {
  setLocation(state, { payload: action.payload.data });
};

export const setLocationsFromAxiosResponse = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<LocationType[]>>, 'payload'>
) => {
  setLocations(state, { payload: action.payload.data });
};

export const removeLocation = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<Pick<LocationType, 'id'>>, 'payload'>
) => {
  delete state.locations[action.payload.id];
};

export const removeLocationFromAxiosResponse = (
  state: LocationsSliceStateType,
  action: Pick<PayloadAction<SerialisedAxiosResponse<Pick<LocationType, 'id'>>>, 'payload'>
) => {
  removeLocation(state, { payload: action.payload.data });
};
