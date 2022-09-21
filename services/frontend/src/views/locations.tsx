/** @format */

import React, { useEffect } from 'react';
import { LocationsTable } from '../components/locations-table';
import { scopesMap } from '../configs/scopes';
import { Authorise, useAuthorisation } from '../routing/authorise';
import { useDispatch, useSelector } from '../store';
import { getLocations } from '../store/slices/locations/thunks';

const _Locations: React.FunctionComponent = () => {
  const { access_token } = useAuthorisation();
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations.locations);

  useEffect(() => {
    if (access_token) dispatch(getLocations({ access_token }));
  }, [access_token]);

  return (
    <>
      <LocationsTable locations={locations} />
    </>
  );
};

export const Locations: React.FunctionComponent = () => (
  <Authorise scopes={[scopesMap.locations.get]}>
    <_Locations />
  </Authorise>
);
