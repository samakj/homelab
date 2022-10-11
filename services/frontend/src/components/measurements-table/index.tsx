/** @format */

import React, { useMemo } from 'react';
import {
  MeasurementsTableCellElement,
  MeasurementsTableElement,
  MeasurementsTableHeaderCellElement,
  MeasurementTagElement,
} from './elements';
import { MeasurementsTablePropsType, MeasurementsTableRowType } from './types';
import { MetricType } from '../../store/slices/metrics/types';

const formatMeasurementValue = (value: unknown, metric?: MetricType): string => {
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
}) => {
  // const theme = useTheme();
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  // const [measurementToEdit, setMeasurementToEdit] = useState<number>();
  // const [measurementToDelete, setMeasurementToDelete] = useState<number>();

  const rows = useMemo(() => {
    const _rows: MeasurementsTableRowType[] = [];

    if (latestMeasurements)
      Object.keys(latestMeasurements).forEach((locationId) => {
        const locationChildren = latestMeasurements[locationId].children;
        Object.keys(locationChildren).forEach((metricId, metricIndex) => {
          const metricsChildren = locationChildren[metricId].children;
          Object.keys(metricsChildren).forEach((tags, tagsIndex) => {
            const tagsChildren = metricsChildren[tags].children;
            Object.keys(tagsChildren).forEach((deviceId, deviceIndex) => {
              _rows.push({
                locationsSpan:
                  !metricIndex && !tagsIndex && !deviceIndex
                    ? latestMeasurements[locationId].count
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
  }, [latestMeasurements]);

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
