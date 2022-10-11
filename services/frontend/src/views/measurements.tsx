/** @format */

import React, { useEffect } from 'react';
import { MeasurementsTable } from '../components/measurements-table';
import { scopesMap } from '../configs/scopes';
import { Authorise, useAuthorisation } from '../routing/authorise';
import { useDispatch, useSelector } from '../store';
import { getMeasurementsLatest } from '../store/slices/measurements/thunks';
import { getLocations } from '../store/slices/locations/thunks';
import { MeasurementType } from '../store/slices/measurements/types';
import { getDevices } from '../store/slices/devices/thunks';
import { getMetrics } from '../store/slices/metrics/thunks';
import { useMeasurementWebsocket } from '../store/slices/measurements/websocket';

const _Measurements: React.FunctionComponent = () => {
  const { access_token } = useAuthorisation();
  const dispatch = useDispatch();
  const measurements = useSelector((state) => state.measurements.measurements);
  const latestMeasurements = useSelector((state) => state.measurements.latest);
  const devices = useSelector((state) => state.devices.devices);
  const locations = useSelector((state) => state.locations.locations);
  const metrics = useSelector((state) => state.metrics.metrics);

  useMeasurementWebsocket({ access_token });

  useEffect(() => {
    if (access_token) dispatch(getMeasurementsLatest({ access_token }));
  }, [access_token, dispatch]);

  useEffect(() => {
    const measurementList = Object.values(measurements || {});
    if (access_token && measurementList.length) {
      const missingDeviceIds: Set<number> = new Set();
      const missingLocationIds: Set<number> = new Set();
      const missingMetricIds: Set<number> = new Set();
      measurementList.forEach((measurement: MeasurementType) => {
        if (!devices?.[measurement.device_id]) missingDeviceIds.add(measurement.device_id);
        if (!locations?.[measurement.location_id]) missingLocationIds.add(measurement.location_id);
        if (!metrics?.[measurement.metric_id]) missingMetricIds.add(measurement.metric_id);
      });
      if (missingDeviceIds.size)
        dispatch(getDevices({ id: Array.from(missingDeviceIds), access_token }));
      if (missingLocationIds.size)
        dispatch(getLocations({ id: Array.from(missingLocationIds), access_token }));
      if (missingMetricIds.size)
        dispatch(getMetrics({ id: Array.from(missingMetricIds), access_token }));
    }
  }, [access_token, dispatch, measurements, locations]);

  console.log(latestMeasurements);

  return (
    <>
      <MeasurementsTable
        measurements={measurements}
        latestMeasurements={latestMeasurements}
        devices={devices}
        locations={locations}
        metrics={metrics}
      />
    </>
  );
};

export const Measurements: React.FunctionComponent = () => (
  <Authorise scopes={[scopesMap.measurements.get]}>
    <_Measurements />
  </Authorise>
);
