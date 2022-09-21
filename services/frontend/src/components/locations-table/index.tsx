/** @format */

import React from 'react';
import { LocationType } from '../../store/slices/locations/types';
import {
  LocationsTableCellElemnt,
  LocationsTableElement,
  LocationsTableHeaderCellElement,
  LocationsTableNameCellElement,
  LocationTagElement,
} from './elements';
import { LocationsTablePropsType } from './types';

export const LocationsTable: React.FunctionComponent<LocationsTablePropsType> = ({ locations }) => {
  return (
    <LocationsTableElement>
      <thead>
        <tr>
          <LocationsTableHeaderCellElement>Name</LocationsTableHeaderCellElement>
          <LocationsTableHeaderCellElement>Tags</LocationsTableHeaderCellElement>
          <LocationsTableHeaderCellElement>Actions</LocationsTableHeaderCellElement>
        </tr>
      </thead>
      <tbody>
        {Object.values(locations || {}).map((location: LocationType) => (
          <tr key={location.id}>
            <LocationsTableNameCellElement>
              {location.name.replace('-', ' ')}
            </LocationsTableNameCellElement>
            <LocationsTableCellElemnt>
              {location.tags.map((tag) => (
                <LocationTagElement key={tag}>{tag}</LocationTagElement>
              ))}
            </LocationsTableCellElemnt>
          </tr>
        ))}
      </tbody>
    </LocationsTableElement>
  );
};
