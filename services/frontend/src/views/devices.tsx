/** @format */

import React, { useEffect } from 'react';
import { DevicesTable } from '../components/devices-table';
import { scopesMap } from '../configs/scopes';
import { Authorise, useAuthorisation } from '../routing/authorise';
import { useDispatch, useSelector } from '../store';
import { getDevices } from '../store/slices/devices/thunks';
import { getLocations } from '../store/slices/locations/thunks';
import { DeviceType } from '../store/slices/devices/types';

const _Devices: React.FunctionComponent = () => {
  const { access_token } = useAuthorisation();
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const locations = useSelector((state) => state.locations.locations);

  useEffect(() => {
    if (access_token) dispatch(getDevices({ access_token }));
  }, [access_token, dispatch]);

  useEffect(() => {
    const deviceList = Object.values(devices || {});
    if (access_token && deviceList.length) {
      const missingLocationIds: Set<number> = new Set();
      deviceList.forEach((device: DeviceType) => {
        if (!locations?.[device.location_id]) missingLocationIds.add(device.location_id);
      });
      if (missingLocationIds.size)
        dispatch(getLocations({ id: Array.from(missingLocationIds), access_token }));
    }
  }, [access_token, dispatch, devices, locations]);

  return (
    <>
      <DevicesTable devices={devices} locations={locations} />
    </>
  );
};

export const Devices: React.FunctionComponent = () => (
  <Authorise scopes={[scopesMap.devices.get]}>
    <_Devices />
  </Authorise>
);
