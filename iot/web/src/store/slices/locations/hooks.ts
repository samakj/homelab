/** @format */
import { LocationType } from '@/models/location';
import { useSelector } from '@/store';

import { useAsyncThunk } from '../../../common/hooks/thunk';
import {
  createLocationThunk,
  deleteLocationThunk,
  getLocationThunk,
  getLocationsThunk,
  updateLocationThunk,
} from './thunks';

export const useCreateLocation = () => useAsyncThunk({ createLocation: createLocationThunk });

export const useGetLocation = () => useAsyncThunk({ getLocation: getLocationThunk });

export const useGetLocations = () => useAsyncThunk({ getLocations: getLocationsThunk });

export const useUpdateLocation = () => useAsyncThunk({ updateLocation: updateLocationThunk });

export const useDeleteLocation = () => useAsyncThunk({ deleteLocation: deleteLocationThunk });

export const useLocation = (id?: LocationType['id']) => {
  const location = useSelector((state) => (id ? state.locations.locations[id] : undefined));
  return location;
};

export const useLocations = () => {
  const locations = useSelector((state) => state.locations.locations);
  return locations;
};
