/** @format */
import { useEffect } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { Main, PageGrid } from '@/components/page-structure';
import { CreateGridCard, GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, THead, TR, Table } from '@/components/table';
import { routes } from '@/router/routes';
import { useDevices, useGetDevices } from '@/store/slices/devices/hooks';
import { useGetLocations, useLocations } from '@/store/slices/locations/hooks';
import { useGetMeasurements, useMeasurements } from '@/store/slices/measurements/hooks';
import { useGetMetrics, useMetrics } from '@/store/slices/metrics/hooks';

import { MeasurementsPagePropsType } from './types';

const Measurements: React.FunctionComponent<MeasurementsPagePropsType> = ({}) => {
  const measurements = useMeasurements();
  const locations = useLocations();
  const devices = useDevices();
  const metrics = useMetrics();

  const { getMeasurements } = useGetMeasurements();
  const { getLocations } = useGetLocations();
  const { getDevices } = useGetDevices();
  const { getMetrics } = useGetMetrics();

  useEffect(() => {
    getMeasurements();
  }, [getMeasurements]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  return (
    <Main>
      <PageGrid>
        <GridCard colSpan={5} rowSpan={5}>
          <Table>
            <THead>
              <TR>
                <TH center>ID</TH>
                <TH left>Timestamp</TH>
                <TH left>Location</TH>
                <TH left>Device</TH>
                <TH left>Metric</TH>
                <TH left>Value</TH>
                <TH left>Tags</TH>
              </TR>
            </THead>
            <TBody>
              {Object.values(measurements).map((measurement) => (
                <TR key={measurement.id}>
                  <TD center>
                    <Link to={generatePath(routes.measurement.path, measurement)}>
                      {measurement.id}
                    </Link>
                  </TD>
                  <TD left>{measurement.timestamp}</TD>
                  <TD left>
                    <Link to={generatePath(routes.location.path, { id: measurement.location_id })}>
                      {locations[measurement.location_id]?.name || measurement.location_id}
                    </Link>
                  </TD>
                  <TD left>
                    <Link to={generatePath(routes.device.path, { id: measurement.device_id })}>
                      {devices[measurement.device_id]?.ip || measurement.device_id}
                    </Link>
                  </TD>
                  <TD left>
                    <Link to={generatePath(routes.metric.path, { id: measurement.metric_id })}>
                      {metrics[measurement.metric_id]?.name || measurement.metric_id}
                    </Link>
                  </TD>
                  <TD left>{measurement.value}</TD>
                  <TD left>{measurement.tags}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GridCard>
        <CreateGridCard to={generatePath(routes.measurement.path, { id: 'create' })} />
      </PageGrid>
    </Main>
  );
};

export default Measurements;
