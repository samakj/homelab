/** @format */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { isIntegerString, isNumberString } from '@/common/numbers';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Main, PageGrid } from '@/components/page-structure';
import { GridCard } from '@/components/page-structure/cards';
import { Select } from '@/components/select';
import { TBody, TD, TH, TR, Table } from '@/components/table';
import { MeasurementType } from '@/models/measurement';
import { routes } from '@/router/routes';
import { useDevices, useGetDevices } from '@/store/slices/devices/hooks';
import { useGetLocations, useLocations } from '@/store/slices/locations/hooks';
import {
  useCreateMeasurement,
  useDeleteMeasurement,
  useGetMeasurement,
  useMeasurement,
  useUpdateMeasurement,
} from '@/store/slices/measurements/hooks';
import { createMeasurementThunk, deleteMeasurementThunk } from '@/store/slices/measurements/thunks';
import { useGetMetrics, useMetrics } from '@/store/slices/metrics/hooks';

import { MeasurementPagePropsType } from './types';

const Measurement: React.FunctionComponent<MeasurementPagePropsType> = ({}) => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => (_id && isIntegerString(_id) ? parseInt(_id) : undefined), [_id]);
  const isCreate = useMemo(() => _id === 'create', [_id]);
  const { getMeasurement } = useGetMeasurement();
  const { getLocations } = useGetLocations();
  const { getDevices } = useGetDevices();
  const { getMetrics } = useGetMetrics();
  const { updateMeasurement } = useUpdateMeasurement();
  const { createMeasurement } = useCreateMeasurement();
  const { deleteMeasurement } = useDeleteMeasurement();
  const measurement = useMeasurement(id);
  const locations = useLocations();
  const devices = useDevices();
  const metrics = useMetrics();

  const [localMeasurement, setLocalMeasurement] = useState<
    Partial<Omit<MeasurementType, 'tags'> & { tags?: string; value?: string }>
  >({
    ...(measurement || {}),
    tags: measurement?.tags?.join(', '),
    value: measurement?.value?.toString(),
  });

  useEffect(() => {
    if (!id && !isCreate) navigate(routes.measurements.path);
  }, [navigate, id, isCreate]);

  useEffect(() => {
    if (id) getMeasurement({ id });
  }, [getMeasurement, id]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  useEffect(() => {
    if (measurement)
      setLocalMeasurement({
        ...(measurement || {}),
        tags: measurement?.tags?.join(', '),
        value: measurement?.value?.toString(),
      });
  }, [measurement]);

  const onTimestampChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMeasurement({
        ...(localMeasurement || {}),
        timestamp: event.currentTarget.value
          ? new Date(event.currentTarget.value).toISOString()
          : undefined,
      });
    },
    [localMeasurement]
  );

  const onTagsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMeasurement({
        ...(localMeasurement || {}),
        tags: event.currentTarget.value,
      });
    },
    [localMeasurement]
  );

  const onValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMeasurement({
        ...(localMeasurement || {}),
        value: event.currentTarget.value,
      });
    },
    [localMeasurement]
  );

  const deviceOptions = useMemo(
    () => Object.values(devices).map((device) => ({ value: device.id, label: device.ip })),
    [devices]
  );

  const selectedDevice = useMemo(
    () => deviceOptions.find((option) => option.value === localMeasurement.device_id),
    [deviceOptions, localMeasurement.device_id]
  );

  const onDeviceChange = useCallback(
    (option: (typeof deviceOptions)[0] | null) => {
      setLocalMeasurement({ ...(localMeasurement || {}), device_id: option?.value });
    },
    [localMeasurement]
  );

  const locationOptions = useMemo(
    () =>
      Object.values(locations).map((location) => ({ value: location.id, label: location.name })),
    [locations]
  );

  const selectedLocation = useMemo(
    () => locationOptions.find((option) => option.value === localMeasurement.location_id),
    [locationOptions, localMeasurement.location_id]
  );

  const onLocationChange = useCallback(
    (option: (typeof locationOptions)[0] | null) => {
      setLocalMeasurement({ ...(localMeasurement || {}), location_id: option?.value });
    },
    [localMeasurement]
  );

  const metricOptions = useMemo(
    () => Object.values(metrics).map((metric) => ({ value: metric.id, label: metric.name })),
    [metrics]
  );

  const selectedMetric = useMemo(
    () => metricOptions.find((option) => option.value === localMeasurement.metric_id),
    [metricOptions, localMeasurement.metric_id]
  );

  const onMetricChange = useCallback(
    (option: (typeof metricOptions)[0] | null) => {
      setLocalMeasurement({ ...(localMeasurement || {}), metric_id: option?.value });
    },
    [localMeasurement]
  );

  const save = useCallback(() => {
    const { id, timestamp, device_id, location_id, metric_id, tags, value } = localMeasurement;

    let parsedValue: string | number | boolean | undefined = value;

    if (!value) parsedValue = undefined;
    else {
      if (measurement) {
        if (typeof measurement.value === 'number') parsedValue = parseFloat(value);
        else if (typeof measurement.value === 'boolean') parsedValue = value === 'true';
      } else {
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (isNumberString(value)) parsedValue = parseFloat(value);
      }
    }

    if (timestamp && device_id && location_id && metric_id) {
      if (isCreate)
        createMeasurement({
          timestamp,
          device_id,
          location_id,
          metric_id,
          value: parsedValue,
          tags:
            tags
              ?.split(',')
              .map((tag) => tag.trim())
              .filter((tag) => !!tag) || [],
        }).then((action) => {
          if (createMeasurementThunk.fulfilled.match(action)) {
            navigate(generatePath(routes.measurement.path, action.payload.data.id));
          }
        });
      else if (id)
        updateMeasurement({
          id,
          timestamp,
          device_id,
          location_id,
          metric_id,
          value: parsedValue,
          tags:
            tags
              ?.split(',')
              .map((tag) => tag.trim())
              .filter((tag) => !!tag) || [],
        });
    }
  }, [localMeasurement, updateMeasurement, createMeasurement, navigate, isCreate, measurement]);

  const del = useCallback(() => {
    const { id } = localMeasurement;
    if (id) {
      deleteMeasurement({ id }).then((action) => {
        if (deleteMeasurementThunk.fulfilled.match(action)) {
          navigate(routes.measurements.path);
        }
      });
    }
  }, [deleteMeasurement, localMeasurement, navigate]);

  return (
    <Main>
      <PageGrid>
        <GridCard rowSpan={5} colSpan={3}>
          <Table>
            <TBody>
              <TR>
                <TH left>ID</TH>
                <TD right>{measurement?.id || '-'}</TD>
              </TR>
              <TR>
                <TH left>Timesetamp</TH>
                <TD right>
                  <Input
                    value={localMeasurement?.timestamp?.replace('Z', '')}
                    onChange={onTimestampChange}
                    type="datetime-local"
                  />
                </TD>
              </TR>
              <TR>
                <TH left>Location</TH>
                <TD right>
                  <Select
                    value={selectedLocation}
                    options={locationOptions}
                    onChange={onLocationChange}
                  />
                </TD>
              </TR>
              <TR>
                <TH left>Device</TH>
                <TD right>
                  <Select
                    value={selectedDevice}
                    options={deviceOptions}
                    onChange={onDeviceChange}
                  />
                </TD>
              </TR>
              <TR>
                <TH left>Metric</TH>
                <TD right>
                  <Select
                    value={selectedMetric}
                    options={metricOptions}
                    onChange={onMetricChange}
                  />
                </TD>
              </TR>
              <TR>
                <TH left>Value</TH>
                <TD right>
                  <Input value={localMeasurement?.value} onChange={onValueChange} />
                </TD>
              </TR>
              <TR>
                <TH left>Tags</TH>
                <TD right>
                  <Input value={localMeasurement?.tags} onChange={onTagsChange} />
                </TD>
              </TR>
            </TBody>
          </Table>
          <Button
            onClick={save}
            disabled={
              !(localMeasurement?.id || isCreate) ||
              !localMeasurement.timestamp ||
              !localMeasurement.device_id ||
              !localMeasurement.location_id ||
              !localMeasurement.metric_id
            }
          >
            Save
          </Button>
          <Button onClick={del} disabled={!localMeasurement?.id}>
            Delete
          </Button>
        </GridCard>
      </PageGrid>
    </Main>
  );
};

export default Measurement;
