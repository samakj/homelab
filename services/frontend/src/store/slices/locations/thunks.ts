/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  CreateLocationParamsType,
  CreateLocationResponseType,
  DeleteLocationParamsType,
  DeleteLocationResponseType,
  GetLocationByNameParamsType,
  GetLocationByNameResponseType,
  GetLocationParamsType,
  GetLocationResponseType,
  GetLocationsParamsType,
  GetLocationsResponseType,
  LocationByNameUrlParamsType,
  LocationByNameUrlPathParamsType,
  LocationsUrlParamsType,
  LocationUrlParamsType,
  LocationUrlPathParamsType,
  UpdateLocationParamsType,
  UpdateLocationResponseType,
} from './types';
import { config } from '../../../config';

export const LocationUrl = new Url<LocationUrlPathParamsType, LocationUrlParamsType>(
  `${config.urls.apis.iot}/v0/locations/:id`
);
export const LocationUrlRequest = new Request(LocationUrl);

export const getLocation = createRequestThunk<GetLocationResponseType, GetLocationParamsType>(
  'getLocation',
  async ({ id, access_token }) =>
    LocationUrlRequest.get({ id, access_token }).then((response) => response.json())
);

export const updateLocation = createRequestThunk<
  UpdateLocationResponseType,
  UpdateLocationParamsType
>('updateLocation', async ({ location, access_token }) =>
  LocationUrlRequest.patch({ id: location.id, access_token }, location).then((response) =>
    response.json()
  )
);

export const deleteLocation = createRequestThunk<
  DeleteLocationResponseType,
  DeleteLocationParamsType
>('deleteLocation', async ({ id, access_token }) =>
  LocationUrlRequest.delete({ id, access_token }).then((response) => response.json())
);

export const LocationByNameUrl = new Url<
  LocationByNameUrlPathParamsType,
  LocationByNameUrlParamsType
>(`${config.urls.apis.iot}/v0/locations/:name`);
export const LocationByNameUrlRequest = new Request(LocationByNameUrl);

export const getLocationByName = createRequestThunk<
  GetLocationByNameResponseType,
  GetLocationByNameParamsType
>('getLocationByName', async ({ name, access_token }) =>
  LocationByNameUrlRequest.get({ name, access_token }).then((response) => response.json())
);

export const LocationsUrl = new Url<null, LocationsUrlParamsType>(
  `${config.urls.apis.iot}/v0/locations`
);
export const LocationsUrlRequest = new Request(LocationsUrl);

export const getLocations = createRequestThunk<GetLocationsResponseType, GetLocationsParamsType>(
  'getLocations',
  async ({ id, name, tags, access_token }) =>
    LocationsUrlRequest.get({ id, name, tags, access_token }).then((response) => response.json())
);

export const createLocation = createRequestThunk<
  CreateLocationResponseType,
  CreateLocationParamsType
>('createLocations', async ({ location, access_token }) =>
  LocationsUrlRequest.post({ access_token }, location).then((response) => response.json())
);
