/** @format */
import { useEffect } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { Main, PageGrid } from '@/components/page-structure';
import { CreateGridCard, GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, THead, TR, Table } from '@/components/table';
import { routes } from '@/router/routes';
import { useDevices, useGetDevices } from '@/store/slices/devices/hooks';
import { useGetLocations, useLocations } from '@/store/slices/locations/hooks';

import { DevicesPagePropsType } from './types';

const Devices: React.FunctionComponent<DevicesPagePropsType> = ({}) => {
  const { getDevices } = useGetDevices();
  const { getLocations } = useGetLocations();
  const devices = useDevices();
  const locations = useLocations();

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <Main>
      <PageGrid>
        <GridCard colSpan={5} rowSpan={5}>
          <Table>
            <THead>
              <TR>
                <TH center>ID</TH>
                <TH center>MAC</TH>
                <TH center>IP</TH>
                <TH center>Location</TH>
                <TH left>Last Message</TH>
              </TR>
            </THead>
            <TBody>
              {Object.values(devices).map((device) => (
                <TR key={device.id}>
                  <TD center>
                    <Link to={generatePath(routes.device.path, device)}>{device.id}</Link>
                  </TD>
                  <TD center>{device.mac}</TD>
                  <TD center>{device.ip}</TD>
                  <TD center>
                    <Link to={generatePath(routes.location.path, { id: device.location_id })}>
                      {locations[device.location_id]?.name || device.location_id}
                    </Link>
                  </TD>
                  <TD left>{device.last_message}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GridCard>
        <CreateGridCard to={generatePath(routes.device.path, { id: 'create' })} />
      </PageGrid>
    </Main>
  );
};

export default Devices;
