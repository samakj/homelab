/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { MdDelete, MdEdit, MdVisibility, MdVisibilityOff, MdWatch } from 'react-icons/md';
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
import { useDispatch } from '../../store';
import {
  getWatchedDevices,
  unwatchDeviceMeasurements,
  watchDeviceMeasurements,
} from '../../store/slices/watched-devices/thunks';

export const DevicesTable: React.FunctionComponent<DevicesTablePropsType> = ({
  devices,
  watchedDeviceMeasurements,
  locations,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isInScope, access_token } = useAuthorisation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [deviceToEdit, setDeviceToEdit] = useState<number>();
  const [deviceToDelete, setDeviceToDelete] = useState<number>();

  const watchDevice = useCallback(
    (id: DeviceType['id']) => {
      if (access_token)
        dispatch(watchDeviceMeasurements({ id, access_token })).then(() =>
          setTimeout(() => {
            dispatch(getWatchedDevices({ access_token }));
          }, 500)
        );
    },
    [dispatch]
  );

  const unwatchDevice = useCallback(
    (id: DeviceType['id']) => {
      if (access_token)
        dispatch(unwatchDeviceMeasurements({ id, access_token })).then(() =>
          setTimeout(() => {
            dispatch(getWatchedDevices({ access_token }));
          }, 500)
        );
    },
    [dispatch]
  );

  const canCreate = useMemo(() => isInScope(scopesMap.devices.create), [isInScope]);
  const canUpdate = useMemo(() => isInScope(scopesMap.devices.update), [isInScope]);
  const canDelete = useMemo(() => isInScope(scopesMap.devices.delete), [isInScope]);
  const canWatch = useMemo(() => isInScope(scopesMap.devices.watch), [isInScope]);
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
            {canWatch && <DevicesTableHeaderCellElement>Messages /h</DevicesTableHeaderCellElement>}
            {canWatch && (
              <DevicesTableHeaderCellElement>Reconnects /h</DevicesTableHeaderCellElement>
            )}
            {hasActions && (
              <DevicesTableHeaderCellElement>Device Actions</DevicesTableHeaderCellElement>
            )}
            {canWatch && (
              <DevicesTableHeaderCellElement>Socket Actions</DevicesTableHeaderCellElement>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.values(devices || {}).map((device: DeviceType) => (
            <tr key={device.id}>
              <DevicesTableCellElement>{device.mac}</DevicesTableCellElement>
              <DevicesTableCellElement>
                <a href={`http://${device.ip}`} target="_blank">
                  {device.ip}
                </a>
              </DevicesTableCellElement>
              <DevicesTableCellElement>{device.websocket_path}</DevicesTableCellElement>
              <DevicesTableCellElement>
                {locations?.[device.location_id]?.name?.replace('-', ' ') || device.location_id}
              </DevicesTableCellElement>
              <DevicesTableCellElement>
                {device?.last_message ? new Date(device?.last_message).toLocaleString() : '-'}
              </DevicesTableCellElement>
              {canWatch && (
                <DevicesTableCellElement>
                  {watchedDeviceMeasurements?.[device?.id]?.first_connect
                    ? (
                        (1000 * 60 * 60 * watchedDeviceMeasurements[device.id].message_count) /
                        (+new Date() -
                          +new Date(watchedDeviceMeasurements[device.id].first_connect))
                      ).toFixed(0)
                    : '-'}
                </DevicesTableCellElement>
              )}
              {canWatch && (
                <DevicesTableCellElement>
                  {watchedDeviceMeasurements?.[device?.id]?.first_connect
                    ? (
                        (1000 * 60 * 60 * watchedDeviceMeasurements[device.id].reconnect_count) /
                        (+new Date() -
                          +new Date(watchedDeviceMeasurements[device.id].first_connect))
                      ).toFixed(2)
                    : '-'}
                </DevicesTableCellElement>
              )}
              {hasActions && (
                <DevicesTableCellElement>
                  {canUpdate && (
                    <IconButtonContainerElement onClick={() => setDeviceToEdit(device.id)}>
                      <MdEdit />
                    </IconButtonContainerElement>
                  )}
                  {canDelete && (
                    <IconButtonContainerElement onClick={() => setDeviceToEdit(device.id)}>
                      <MdDelete />
                    </IconButtonContainerElement>
                  )}
                </DevicesTableCellElement>
              )}
              {canWatch && (
                <DevicesTableCellElement>
                  <IconButtonContainerElement onClick={() => watchDevice(device.id)}>
                    <MdVisibility />
                  </IconButtonContainerElement>
                  <IconButtonContainerElement onClick={() => unwatchDevice(device.id)}>
                    <MdVisibilityOff color={theme.colours.red} />
                  </IconButtonContainerElement>
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
