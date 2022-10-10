/** @format */

import React, { useMemo } from 'react';
import { MeasurementType } from '../../store/slices/measurements/types';
import {
  MeasurementsTableCellElement,
  MeasurementsTableElement,
  MeasurementsTableHeaderCellElement,
  MeasurementTagElement,
} from './elements';
import {
  GroupedMeasurementsType,
  MeasurementsTablePropsType,
  MeasurementsTableRowType,
} from './types';
import { deepSetIfNullish } from '../../utils/deep';
import { MetricType } from '../../store/slices/metrics/types';

const serialiseTags = (tags: string[]): string => [...tags].sort().join(',');

const countChildren = (obj: Record<string | number, any> | number): number => {
  if (typeof obj === 'number') return 1;
  return Object.values(obj).reduce((acc, child) => acc + countChildren(child), 0);
};

const formatMeasurementValue = (value: unknown, metric?: MetricType): string => {
  let formattedValue = '-';

  if (value != null) {
    if (['temperature', 'humidity', 'percentage'].includes(metric?.name || '-')) {
      formattedValue = `${(value as number).toFixed(1)}${metric?.unit || ''}`;
    } else {
      formattedValue = value.toString();
    }
  }

  return formattedValue;
};

export const MeasurementsTable: React.FunctionComponent<MeasurementsTablePropsType> = ({
  measurements,
  devices,
  locations,
  metrics,
}) => {
  // const theme = useTheme();
  // const { isInScope } = useAuthorisation();
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  // const [measurementToEdit, setMeasurementToEdit] = useState<number>();
  // const [measurementToDelete, setMeasurementToDelete] = useState<number>();

  const groupedMeasurements = useMemo(() => {
    const _groupedMeasurements: GroupedMeasurementsType = {};

    Object.values(measurements || {}).forEach((measurement: MeasurementType) => {
      const serialisedTags = serialiseTags(measurement.tags);
      deepSetIfNullish(_groupedMeasurements, [measurement.location_id], { count: 0, children: {} });
      deepSetIfNullish(
        _groupedMeasurements,
        [measurement.location_id, 'children', measurement.metric_id],
        { count: 0, children: {} }
      );
      deepSetIfNullish(
        _groupedMeasurements,
        [measurement.location_id, 'children', measurement.metric_id, 'children', serialisedTags],
        { count: 0, children: {} }
      );

      _groupedMeasurements[measurement.location_id].count += 1;
      _groupedMeasurements[measurement.location_id].children[measurement.metric_id].count += 1;
      _groupedMeasurements[measurement.location_id].children[measurement.metric_id].children[
        serialisedTags
      ].count += 1;
      _groupedMeasurements[measurement.location_id].children[measurement.metric_id].children[
        serialisedTags
      ].children[measurement.device_id] = measurement.id;
    });

    return _groupedMeasurements;
  }, [measurements]);

  const rows = useMemo(() => {
    const _rows: MeasurementsTableRowType[] = [];

    Object.keys(groupedMeasurements).forEach((locationId) => {
      const locationChildren = groupedMeasurements[locationId].children;
      Object.keys(locationChildren).forEach((metricId, metricIndex) => {
        const metricsChildren = locationChildren[metricId].children;
        Object.keys(metricsChildren).forEach((tags, tagsIndex) => {
          const tagsChildren = metricsChildren[tags].children;
          Object.keys(tagsChildren).forEach((deviceId, deviceIndex) => {
            _rows.push({
              locationsSpan:
                !metricIndex && !tagsIndex && !deviceIndex
                  ? groupedMeasurements[locationId].count
                  : 0,
              metricsSpan: !tagsIndex && !deviceIndex ? locationChildren[metricId].count : 0,
              tagsSpan: !deviceIndex ? metricsChildren[tags].count : 0,
              metricIndex,
              tagsIndex,
              deviceIndex,
              measurementId: tagsChildren[deviceId],
            });
          });
        });
      });
    });

    return _rows;
  }, [groupedMeasurements]);

  // const canCreate = useMemo(() => isInScope(scopesMap.measurements.create), [isInScope]);
  // const canUpdate = useMemo(() => isInScope(scopesMap.measurements.update), [isInScope]);
  // const canDelete = useMemo(() => isInScope(scopesMap.measurements.delete), [isInScope]);
  // const hasActions = useMemo(() => canUpdate || canDelete, [canUpdate, canDelete]);

  return (
    <>
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
                  {formatMeasurementValue(measurement?.value, metric)}
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
