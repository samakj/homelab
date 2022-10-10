/** @format */

import React, { useMemo, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useTheme } from 'styled-components';
import { scopesMap } from '../../configs/scopes';
import { useAuthorisation } from '../../routing/authorise';
import { DeviceType } from '../../store/slices/devices/types';
import { DeleteModal } from './modals/delete';
import { EditModal } from './modals/edit';
import { CreateModal } from './modals/create';
import {
  IconButtonContainerElement,
  DevicesTableCellElement,
  DevicesTableElement,
  DevicesTableHeaderCellElement,
} from './elements';
import { DevicesTablePropsType } from './types';
import { Button } from '../button';

export const DevicesTable: React.FunctionComponent<DevicesTablePropsType> = ({
  devices,
  locations,
}) => {
  const theme = useTheme();
  const { isInScope } = useAuthorisation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [deviceToEdit, setDeviceToEdit] = useState<number>();
  const [deviceToDelete, setDeviceToDelete] = useState<number>();

  const canCreate = useMemo(() => isInScope(scopesMap.devices.create), [isInScope]);
  const canUpdate = useMemo(() => isInScope(scopesMap.devices.update), [isInScope]);
  const canDelete = useMemo(() => isInScope(scopesMap.devices.delete), [isInScope]);
  const hasActions = useMemo(() => canUpdate || canDelete, [canUpdate, canDelete]);

  return (
    <>
      <DevicesTableElement>
        <thead>
          <tr>
            <DevicesTableHeaderCellElement>MAC</DevicesTableHeaderCellElement>
            <DevicesTableHeaderCellElement>IP</DevicesTableHeaderCellElement>
            <DevicesTableHeaderCellElement>Websocket Path</DevicesTableHeaderCellElement>
            <DevicesTableHeaderCellElement>Location</DevicesTableHeaderCellElement>
            <DevicesTableHeaderCellElement>Last Message</DevicesTableHeaderCellElement>
            {hasActions && <DevicesTableHeaderCellElement>Actions</DevicesTableHeaderCellElement>}
          </tr>
        </thead>
        <tbody>
          {Object.values(devices || {}).map((device: DeviceType) => (
            <tr key={device.id}>
              <DevicesTableCellElement>{device.mac}</DevicesTableCellElement>
              <DevicesTableCellElement>{device.ip}</DevicesTableCellElement>
              <DevicesTableCellElement>{device.websocket_path}</DevicesTableCellElement>
              <DevicesTableCellElement>
                {locations?.[device.location_id]?.name?.replace('-', ' ') || device.location_id}
              </DevicesTableCellElement>
              <DevicesTableCellElement>
                {device?.last_message ? new Date(device?.last_message).toLocaleString() : '-'}
              </DevicesTableCellElement>
              {hasActions && (
                <DevicesTableCellElement>
                  {canUpdate && (
                    <IconButtonContainerElement onClick={() => setDeviceToEdit(device.id)}>
                      <MdEdit />
                    </IconButtonContainerElement>
                  )}
                  {canDelete && (
                    <IconButtonContainerElement onClick={() => setDeviceToDelete(device.id)}>
                      <MdDelete color={theme.colours.red} />
                    </IconButtonContainerElement>
                  )}
                </DevicesTableCellElement>
              )}
            </tr>
          ))}
          {canCreate && (
            <tr>
              <DevicesTableCellElement colSpan={99}>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create New Device</Button>
              </DevicesTableCellElement>
            </tr>
          )}
        </tbody>
      </DevicesTableElement>
      {canCreate && (
        <CreateModal isOpen={isCreateModalOpen} close={() => setIsCreateModalOpen(false)} />
      )}
      {canUpdate && <EditModal deviceId={deviceToEdit} close={() => setDeviceToEdit(undefined)} />}
      {canDelete && (
        <DeleteModal deviceId={deviceToDelete} close={() => setDeviceToDelete(undefined)} />
      )}
    </>
  );
};
