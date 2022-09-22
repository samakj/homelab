/** @format */

import React, { useMemo, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useTheme } from 'styled-components';
import { scopesMap } from '../../configs/scopes';
import { useAuthorisation } from '../../routing/authorise';
import { LocationType } from '../../store/slices/locations/types';
import { DeleteModal } from './modals/delete';
import { EditModal } from './modals/edit';
import { CreateModal } from './modals/create';
import {
  IconButtonContainerElement,
  LocationsTableCellElement,
  LocationsTableElement,
  LocationsTableHeaderCellElement,
  LocationsTableNameCellElement,
  LocationTagElement,
} from './elements';
import { LocationsTablePropsType } from './types';
import { Button } from '../button';

export const LocationsTable: React.FunctionComponent<LocationsTablePropsType> = ({ locations }) => {
  const theme = useTheme();
  const { isInScope } = useAuthorisation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [locationToEdit, setLocationToEdit] = useState<number>();
  const [locationToDelete, setLocationToDelete] = useState<number>();

  const canCreate = useMemo(() => isInScope(scopesMap.locations.create), [isInScope]);
  const canUpdate = useMemo(() => isInScope(scopesMap.locations.update), [isInScope]);
  const canDelete = useMemo(() => isInScope(scopesMap.locations.delete), [isInScope]);
  const hasActions = useMemo(() => canUpdate || canDelete, [canUpdate, canDelete]);

  return (
    <>
      <LocationsTableElement>
        <thead>
          <tr>
            <LocationsTableHeaderCellElement>Name</LocationsTableHeaderCellElement>
            <LocationsTableHeaderCellElement>Tags</LocationsTableHeaderCellElement>
            {hasActions && (
              <LocationsTableHeaderCellElement>Actions</LocationsTableHeaderCellElement>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.values(locations || {}).map((location: LocationType) => (
            <tr key={location.id}>
              <LocationsTableNameCellElement>
                {location.name.replace('-', ' ')}
              </LocationsTableNameCellElement>
              <LocationsTableCellElement>
                {location.tags.map((tag) => (
                  <LocationTagElement key={tag}>{tag}</LocationTagElement>
                ))}
              </LocationsTableCellElement>
              {hasActions && (
                <LocationsTableCellElement>
                  {canUpdate && (
                    <IconButtonContainerElement onClick={() => setLocationToEdit(location.id)}>
                      <MdEdit />
                    </IconButtonContainerElement>
                  )}
                  {canDelete && (
                    <IconButtonContainerElement onClick={() => setLocationToDelete(location.id)}>
                      <MdDelete color={theme.colours.red} />
                    </IconButtonContainerElement>
                  )}
                </LocationsTableCellElement>
              )}
            </tr>
          ))}
          {canCreate && (
            <tr>
              <LocationsTableCellElement colSpan={99}>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create New Location</Button>
              </LocationsTableCellElement>
            </tr>
          )}
        </tbody>
      </LocationsTableElement>
      {canCreate && (
        <CreateModal isOpen={isCreateModalOpen} close={() => setIsCreateModalOpen(false)} />
      )}
      {canUpdate && (
        <EditModal locationId={locationToEdit} close={() => setLocationToEdit(undefined)} />
      )}
      {canDelete && (
        <DeleteModal locationId={locationToDelete} close={() => setLocationToDelete(undefined)} />
      )}
    </>
  );
};
