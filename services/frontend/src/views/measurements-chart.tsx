/** @format */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scopesMap } from '../configs/scopes';
import { Authorise, useAuthorisation } from '../routing/authorise';
import { useDispatch, useSelector } from '../store';
import { getMeasurementsChart } from '../store/slices/measurements/thunks';
import { ExtendedSet } from '../utils/set';
import { MeasurementsChart as MeasurementsChartComponent } from '../components/measurements-chart';
import { getLocations } from '../store/slices/locations/thunks';
import { getDevices } from '../store/slices/devices/thunks';
import { getMetrics } from '../store/slices/metrics/thunks';

const _MeasurementsChart: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationIds, setLocationIds] = useState(
    new ExtendedSet(searchParams.getAll('locationId').map((id) => parseInt(id)))
  );
  const [metricIds, setMetricIds] = useState(
    new ExtendedSet(searchParams.getAll('metricId').map((id) => parseInt(id)))
  );
  const [deviceIds] = useState(
    new ExtendedSet(searchParams.getAll('deviceId').map((id) => parseInt(id)))
  );
  const [tags, setTags] = useState(new ExtendedSet(searchParams.getAll('tags')));
  const [from, setFrom] = useState(
    // @ts-ignore: Check beforehand isnt picked up by ts
    searchParams.get('from') ? new Date(searchParams.get('from') + 'Z') : undefined
  );
  const [to, setTo] = useState(
    // @ts-ignore: Check beforehand isnt picked up by ts
    searchParams.get('to') ? new Date(searchParams.get('to') + 'Z') : undefined
  );
  const [pointCount] = useState(
    // @ts-ignore: Check beforehand isnt picked up by ts
    searchParams.get('pointCount') ? parseInt(searchParams.get('pointCount')) : 50
  );

  useEffect(() => {
    if (access_token) {
      dispatch(getLocations({ access_token }));
      dispatch(getDevices({ access_token }));
      dispatch(getMetrics({ access_token }));
    }
  }, [dispatch, access_token]);

  useEffect(() => {
    if (access_token) {
      dispatch(
        getMeasurementsChart({
          access_token,
          location_id: locationIds.size ? locationIds.toArray() : undefined,
          metric_id: metricIds.size ? metricIds.toArray() : undefined,
          device_id: deviceIds.size ? deviceIds.toArray() : undefined,
          tags: tags.size ? tags.toArray() : undefined,
          timestamp_gte: from?.toISOString(),
          timestamp_lte: to?.toISOString(),
          point_count: pointCount,
        })
      );
    }

    const newParams: Record<string, string | string[]> = {};
    if (locationIds.size) newParams.locationId = locationIds.map((id) => id.toString()).toArray();
    if (metricIds.size) newParams.metricId = metricIds.map((id) => id.toString()).toArray();
    if (deviceIds.size) newParams.deviceId = deviceIds.map((id) => id.toString()).toArray();
    if (tags.size) newParams.tags = tags.toArray();
    if (from != null) newParams.from = from.toISOString().slice(0, 16);
    if (to != null) newParams.to = to.toISOString().slice(0, 16);
    newParams.pointCount = pointCount.toString();
    setSearchParams(newParams);
  }, [
    dispatch,
    access_token,
    locationIds,
    metricIds,
    deviceIds,
    tags,
    from,
    to,
    pointCount,
    setSearchParams,
  ]);

  const measurementsChart = useSelector((store) => store.measurements.chart);
  const locations = useSelector((store) => store.locations.locations);
  const devices = useSelector((store) => store.devices.devices);
  const metrics = useSelector((store) => store.metrics.metrics);

  return (
    <MeasurementsChartComponent
      locationIds={locationIds}
      setLocationIds={setLocationIds}
      metricIds={metricIds}
      setMetricIds={setMetricIds}
      tags={tags}
      setTags={setTags}
      from={from}
      setFrom={setFrom}
      to={to}
      setTo={setTo}
      measurementsChart={measurementsChart}
      locations={locations}
      devices={devices}
      metrics={metrics}
    />
  );
};

export const MeasurementsChart: React.FunctionComponent = () => (
  <Authorise scopes={[scopesMap.measurements.get]}>
    <_MeasurementsChart />
  </Authorise>
);
