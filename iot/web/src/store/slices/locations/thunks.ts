/** @format */
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from '@/apis/iot/locations';
import { createAxiosThunk } from '@/common/thunks';

export const createLocationThunk = createAxiosThunk('locations/createLocation', createLocation);

export const getLocationThunk = createAxiosThunk('locations/getLocation', getLocation);

export const getLocationsThunk = createAxiosThunk('locations/getLocations', getLocations);

export const updateLocationThunk = createAxiosThunk('locations/updateLocation', updateLocation);

export const deleteLocationThunk = createAxiosThunk('locations/deleteLocation', deleteLocation);
