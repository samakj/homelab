/** @format */
import { LocationType } from '@/models/location';

export interface LocationsSliceStateType {
  locations: { [id: LocationType['id']]: LocationType };
}
