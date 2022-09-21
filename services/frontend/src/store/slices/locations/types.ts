/** @format */

import { RequestMetaType } from '../types';

export interface LocationType {
  id: number;
  name: string;
  tags: string[];
}

export interface LocationUrlPathParamsType {
  id: LocationType['id'];
}

export interface LocationUrlParamsType {
  access_token: string;
}

export interface LocationByNameUrlPathParamsType {
  name: LocationType['name'];
}

export interface LocationByNameUrlParamsType {
  access_token: string;
}

export interface LocationsUrlParamsType {
  access_token: string;
  id?: LocationType['id'] | LocationType['id'][];
  name?: LocationType['name'] | LocationType['name'][];
  tags?: LocationType['tags'] | LocationType['tags'][];
}

export interface GetLocationParamsType extends LocationUrlPathParamsType, LocationUrlParamsType {}

export type GetLocationResponseType = LocationType;

export interface GetLocationByNameParamsType
  extends LocationByNameUrlPathParamsType,
    LocationByNameUrlParamsType {}

export type GetLocationByNameResponseType = LocationType;

export interface GetLocationsParamsType extends LocationsUrlParamsType {}

export type GetLocationsResponseType = LocationType[];

export interface CreateLocationParamsType extends LocationsUrlParamsType {
  location: Omit<LocationType, 'id'>;
}

export type CreateLocationResponseType = LocationType;

export interface UpdateLocationParamsType extends LocationUrlParamsType {
  location: LocationType;
}

export type UpdateLocationResponseType = LocationType;

export interface DeleteLocationParamsType
  extends LocationUrlPathParamsType,
    LocationUrlParamsType {}

export type DeleteLocationResponseType = null;

export interface LocationsStateType {
  [locationId: number]: LocationType;
}

export interface LocationsSliceType {
  requests: {
    getLocation: RequestMetaType;
    getLocationByName: RequestMetaType;
    getLocations: RequestMetaType;
    createLocation: RequestMetaType;
    updateLocation: RequestMetaType;
    deleteLocation: RequestMetaType;
  };
  locations?: LocationsStateType;
}
