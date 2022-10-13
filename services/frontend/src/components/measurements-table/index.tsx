/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import {
  FiltersContainerElement,
  MeasurementsTableCellElement,
  MeasurementsTableElement,
  MeasurementsTableHeaderCellElement,
  MeasurementTagElement,
} from './elements';
import { useSearchParams } from 'react-router-dom';
import { MultiValue } from 'react-select';
import { MeasurementsTablePropsType, MeasurementsTableRowType } from './types';
import { MetricType } from '../../store/slices/metrics/types';
import { MeasurementType, ValueTypeEnum } from '../../store/slices/measurements/types';
import { LocationType } from '../../store/slices/locations/types';
import { Select } from '../select';
import { ExtendedSet } from '../../utils/set';

const formatMeasurementValue = (
  measurement: Pick<MeasurementType, 'value' | 'value_type'>,
  metric?: MetricType
): string => {
  if (!measurement) return '-';
  let { value, value_type } = measurement;
  if (value_type === ValueTypeEnum.INTEGER && typeof value == 'string') value = parseInt(value);
  if (value_type === ValueTypeEnum.FLOAT && typeof value == 'string') value = parseFloat(value);
  if (typeof value === 'number') {
    if (['temperature', 'humidity', 'percentage'].includes(metric?.name || '-'))
      return `${(value as number)?.toFixed(1)}${metric?.unit || ''}`;
    return value.toPrecision(3);
  } else if (['null', 'undefined'].includes(typeof value)) return '-';
  else return value?.toString() || '-';
};

export const MeasurementsTable: React.FunctionComponent<MeasurementsTablePropsType> = ({
  measurements,
  latestMeasurements,
  devices,
  locations,
  metrics,
  filters = true,
}) => {
  const [searchParams, setSeachParams] = useSearchParams();
  const [locationFilters, setLocationsFilter] = useState<ExtendedSet<LocationType['id']>>(
    new ExtendedSet(searchParams.getAll('location').map((param) => parseInt(param)))
  );
  const [metricFilters, setMetricsFilter] = useState<ExtendedSet<MetricType['id']>>(
    new ExtendedSet(searchParams.getAll('metric').map((param) => parseInt(param)))
  );
  const [tagsFilters, setTagsFilter] = useState<ExtendedSet<MeasurementType['tags'][number]>>(
    new ExtendedSet(searchParams.getAll('tag'))
  );

  const rows = useMemo(() => {
    const _rows: MeasurementsTableRowType[] = [];

    if (latestMeasurements)
      Object.keys(latestMeasurements).forEach((locationId) => {
        const locationChildren = latestMeasurements[locationId].children;
        let metricIndex = 0;
        let locationSpan = 0;
        Object.keys(locationChildren).forEach((metricId) => {
          const metricsChildren = locationChildren[metricId].children;
          let tagsIndex = 0;
          let metricsSpan = 0;
          Object.keys(metricsChildren).forEach((tags) => {
            const tagsChildren = metricsChildren[tags].children;
            let deviceIndex = 0;
            Object.keys(tagsChildren).forEach((deviceId) => {
              if (locationFilters.size && !locationFilters.has(parseInt(locationId))) return;
              if (metricFilters.size && !metricFilters.has(parseInt(metricId))) return;
              if (tagsFilters.size && !tags.split(',').some((tag) => tagsFilters.has(tag))) return;
              _rows.push({
                locationsSpan: !metricIndex && !tagsIndex && !deviceIndex ? 1 : 0,
                metricsSpan: !tagsIndex && !deviceIndex ? 1 : 0,
                tagsSpan: !deviceIndex ? 1 : 0,
                metricIndex,
                tagsIndex,
                deviceIndex,
                measurementId: tagsChildren[deviceId],
              });
              metricIndex += 1;
              tagsIndex += 1;
              deviceIndex += 1;
            });
            if (deviceIndex) _rows[_rows.length - deviceIndex].tagsSpan = deviceIndex;
            metricsSpan += deviceIndex;
            locationSpan += deviceIndex;
          });
          if (tagsIndex) _rows[_rows.length - tagsIndex].metricsSpan = metricsSpan;
        });
        if (metricIndex) _rows[_rows.length - metricIndex].locationsSpan = locationSpan;
      });

    return _rows;
  }, [latestMeasurements, locationFilters, metricFilters, tagsFilters]);

  const locationOptions = useMemo(
    () =>
      Object.values(locations || {}).map((location: LocationType) => ({
        value: location.id,
        label: location.name,
      })),
    [locations]
  );

  const selectedLocations = useMemo(
    () => locationOptions.filter((option) => locationFilters.has(option.value)),
    [locationOptions, locationFilters]
  );

  const selectLocations = useCallback(
    (options?: MultiValue<typeof locationOptions[number]>) => {
      const locations =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<LocationType['id']>()) || new ExtendedSet<LocationType['id']>();
      setLocationsFilter(locations);
      setSeachParams({ location: locations.map((id) => id.toString()).toArray() });
    },
    [setLocationsFilter]
  );

  const metricOptions = useMemo(
    () =>
      Object.values(metrics || {}).map((metric: MetricType) => ({
        value: metric.id,
        label: metric.name,
      })),
    [metrics]
  );

  const selectedMetrics = useMemo(
    () => metricOptions.filter((option) => metricFilters.has(option.value)),
    [metricOptions, metricFilters]
  );

  const selectMetrics = useCallback(
    (options?: MultiValue<typeof metricOptions[number]>) => {
      const metrics =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<MetricType['id']>()) || new ExtendedSet<MetricType['id']>();
      setMetricsFilter(metrics);
      setSeachParams({ metric: metrics.map((id) => id.toString()).toArray() });
    },
    [setMetricsFilter]
  );

  const tagOptions = useMemo(
    () =>
      (
        Object.values(measurements || {}).reduce((acc, measurement: MeasurementType) => {
          measurement.tags.forEach((tag) => acc.add(tag));
          return acc;
        }, new ExtendedSet()) as ExtendedSet<MeasurementType['tags'][number]>
      )
        .map((tag: MeasurementType['tags'][number]) => ({
          value: tag,
          label: tag,
        }))
        .toArray(),
    [measurements]
  );

  const selectedTags = useMemo(
    () => tagOptions.filter((option) => tagsFilters.has(option.value)),
    [tagOptions, tagsFilters]
  );

  const selectTags = useCallback(
    (options?: MultiValue<typeof tagOptions[number]>) => {
      const tags =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<MeasurementType['tags'][number]>()) ||
        new ExtendedSet<MeasurementType['tags'][number]>();
      setTagsFilter(tags);
      setSeachParams({ tag: tags.toArray() });
    },
    [setTagsFilter]
  );

  return (
    <>
      {filters && (
        <FiltersContainerElement>
          <Select
            label="Location"
            value={selectedLocations}
            options={locationOptions}
            onChange={selectLocations}
            isMulti
          />
          <Select
            label="Metric"
            value={selectedMetrics}
            options={metricOptions}
            onChange={selectMetrics}
            isMulti
          />
          <Select
            label="Tags"
            value={selectedTags}
            options={tagOptions}
            onChange={selectTags}
            isMulti
          />
        </FiltersContainerElement>
      )}
      <MeasurementsTableElement>
        <thead>
          <tr>
            <MeasurementsTableHeaderCellElement>Location</MeasurementsTableHeaderCellElement>
            <MeasurementsTableHeaderCellElement>Metric</MeasurementsTableHeaderCellElement>
            <MeasurementsTableHeaderCellElement>Tags</MeasurementsTableHeaderCellElement>
            <MeasurementsTableHeaderCellElement>Device</MeasurementsTableHeaderCellElement>
            <MeasurementsTableHeaderCellElement>Value</MeasurementsTableHeaderCellElement>
            <MeasurementsTableHeaderCellElement>Time</MeasurementsTableHeaderCellElement>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const measurement = measurements?.[row.measurementId];
            const location = measurement && locations?.[measurement.location_id];
            const metric = measurement && metrics?.[measurement.metric_id];
            const device = measurement && devices?.[measurement.device_id];
            return (
              <tr key={row.measurementId}>
                {!!row.locationsSpan && (
                  <MeasurementsTableCellElement rowSpan={row.locationsSpan}>
                    {location?.name || measurement?.location_id}
                  </MeasurementsTableCellElement>
                )}
                {!!row.metricsSpan && (
                  <MeasurementsTableCellElement rowSpan={row.metricsSpan}>
                    {metric?.name || measurement?.metric_id}
                  </MeasurementsTableCellElement>
                )}
                {!!row.tagsSpan && (
                  <MeasurementsTableCellElement rowSpan={row.tagsSpan}>
                    {measurement?.tags?.map((tag) => (
                      <MeasurementTagElement key={tag}>{tag}</MeasurementTagElement>
                    ))}
                  </MeasurementsTableCellElement>
                )}
                <MeasurementsTableCellElement>
                  {device?.mac || measurement?.device_id}
                </MeasurementsTableCellElement>
                <MeasurementsTableCellElement>
                  {formatMeasurementValue(measurement, metric)}
                </MeasurementsTableCellElement>
                <MeasurementsTableCellElement>
                  {measurement?.timestamp ? new Date(measurement?.timestamp).toLocaleString() : '-'}
                </MeasurementsTableCellElement>
              </tr>
            );
          })}
        </tbody>
      </MeasurementsTableElement>
    </>
  );
};
