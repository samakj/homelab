/** @format */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiValue } from 'react-select';
import { DeviceType } from '../../store/slices/devices/types';
import { LocationType } from '../../store/slices/locations/types';
import {
  ChartMeasurementsStateType,
  MeasurementsChartLinePointType,
  MeasurementsChartLinesType,
  MeasurementsChartLineType,
  MeasurementsChartMetricsType,
  MeasurementType,
} from '../../store/slices/measurements/types';
import { MetricType } from '../../store/slices/metrics/types';
import { ExtendedSet } from '../../utils/set';
import { Select } from '../select';
import {
  FiltersContainerElement,
  ChartContainerElement,
  LayoutGridElement,
  MainTooltip,
  LocationHeaderElement,
  DateHeaderElement,
  MetricELement,
  LocationLabelElement,
  LocationColourElement,
} from './elements';
import { MeasurementChartPropsType, NearestPointsType } from './types';
import { Input } from '../input';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridColumns } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
import { LinePath, Line } from '@visx/shape';
import { Group } from '@visx/group';
import { RectClipPath } from '@visx/clip-path';
import { curveMonotoneX } from '@visx/curve';
import { useTheme } from 'styled-components';
import { DAY_IN_MS, toLocaleISOString } from '../../utils';
import { DateLike } from '../../types';
import { Checkbox } from '../checkbox';

export const MeasurementsChart: React.FunctionComponent<MeasurementChartPropsType> = ({
  locationIds,
  setLocationIds,
  metricIds,
  setMetricIds,
  deviceIds,
  setDeviceIds,
  tags,
  setTags,
  from,
  setFrom,
  to,
  setTo,
  autoReload,
  setAutoReload,
  measurementsChart,
  locations,
  devices,
  metrics,
  filters = true,
  yAxisPadding = 0.1,
}) => {
  const theme = useTheme();

  const locationOptions = useMemo(
    () =>
      Object.values(locations || {}).map((location: LocationType) => ({
        value: location.id,
        label: (
          <LocationLabelElement>
            <LocationColourElement style={{ background: theme.colours.chartLines[location.id] }} />
            <div>{location.name}</div>
          </LocationLabelElement>
        ),
      })),
    [locations, theme]
  );

  const selectedLocations = useMemo(
    () => locationOptions.filter((option) => locationIds?.has(option.value)),
    [locationOptions, locationIds]
  );

  const selectLocations = useCallback(
    (options?: MultiValue<typeof locationOptions[number]>) => {
      const locations =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<LocationType['id']>()) || new ExtendedSet<LocationType['id']>();
      setLocationIds?.(locations);
    },
    [setLocationIds]
  );

  const deviceOptions = useMemo(
    () =>
      Object.values(devices || {}).map((device: DeviceType) => ({
        value: device.id,
        label: device.mac,
      })),
    [devices]
  );

  const selectedDevices = useMemo(
    () => deviceOptions.filter((option) => deviceIds?.has(option.value)),
    [deviceOptions, deviceIds]
  );

  const selectDevices = useCallback(
    (options?: MultiValue<typeof locationOptions[number]>) => {
      const locations =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<LocationType['id']>()) || new ExtendedSet<LocationType['id']>();
      setDeviceIds?.(locations);
    },
    [setDeviceIds]
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
    () => metricOptions.filter((option) => metricIds?.has(option.value)),
    [metricOptions, metricIds]
  );

  const selectMetrics = useCallback(
    (options?: MultiValue<typeof metricOptions[number]>) => {
      const metrics =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<MetricType['id']>()) || new ExtendedSet<MetricType['id']>();
      setMetricIds?.(metrics);
    },
    [setMetricIds]
  );

  const tagOptions = useMemo(
    () =>
      (
        Object.values(measurementsChart?.lines || {}).reduce(
          (acc, line: ChartMeasurementsStateType['lines'][string]) => {
            line.tags?.forEach((tag) => acc.add(tag));
            return acc;
          },
          new ExtendedSet()
        ) as ExtendedSet<MeasurementType['tags'][number]>
      )
        .map((tag: MeasurementType['tags'][number]) => ({
          value: tag,
          label: tag,
        }))
        .toArray(),
    [measurementsChart]
  );

  const selectedTags = useMemo(
    () => tagOptions.filter((option) => tags?.has(option.value)),
    [tagOptions, tags]
  );

  const selectTags = useCallback(
    (options?: MultiValue<typeof tagOptions[number]>) => {
      const tags =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<MeasurementType['tags'][number]>()) ||
        new ExtendedSet<MeasurementType['tags'][number]>();
      setTags?.(tags);
    },
    [setTags]
  );

  //   CHART PROPERTIES
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ReturnType<typeof setTimeout>>();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartPadding] = useState({ top: 0, left: 0, bottom: 32, right: 0 });
  const chartBoundingBox = useMemo(
    () => ({
      top: chartPadding.top,
      left: chartPadding.left,
      bottom: chartHeight - chartPadding.bottom,
      right: chartWidth - chartPadding.right,
      innerHeight: chartHeight - chartPadding.top - chartPadding.bottom,
      innerWidth: chartWidth - chartPadding.left - chartPadding.right,
    }),
    [chartHeight, chartWidth, chartPadding]
  );
  const observerRef = useRef(
    new ResizeObserver(([element]) => {
      clearTimeout(resizeRef.current);
      resizeRef.current = setTimeout(() => {
        setChartHeight(element.contentRect.height);
        setChartWidth(element.contentRect.width);
      }, 100);
    })
  );

  useEffect(() => {
    const observer = observerRef.current;
    if (chartContainerRef.current) observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, [chartContainerRef, observerRef]);

  const dateRange = useMemo(
    () => [
      new Date(from ? from.toISOString() : measurementsChart?.timestamp?.min || '2000'),
      new Date(to ? to.toISOString() : measurementsChart?.timestamp?.max || '2050'),
    ],
    [measurementsChart, from, to]
  );

  const dateScale = useMemo(
    () => scaleTime({ range: [0, chartBoundingBox.innerWidth], domain: dateRange }),
    [dateRange, chartBoundingBox.innerWidth]
  );

  const metricsRanges = useMemo(
    () =>
      Object.entries(measurementsChart?.metrics || ({} as MeasurementsChartMetricsType)).reduce(
        (acc, [metricId, metricRange]) => {
          if (metricRange.max != null && metricRange.min != null)
            acc[metricId] = [
              metricRange.max + (metricRange.max - metricRange.min) * yAxisPadding,
              metricRange.min - (metricRange.max - metricRange.min) * yAxisPadding,
            ];
          return acc;
        },
        {}
      ),
    [measurementsChart, from, to]
  );

  const metricsScales = useMemo(
    () =>
      Object.entries(metricsRanges).reduce((acc, [metricId, metricRange]) => {
        acc[metricId] = scaleLinear({
          range: [0, chartBoundingBox.innerHeight],
          domain: metricRange as [number, number],
        });
        return acc;
      }, {}),
    [dateRange, metricsRanges, chartBoundingBox.innerHeight]
  );

  const dateFormatter = useCallback(
    (date: DateLike) => {
      const _date = new Date(+date);
      if (dateRange[1].getDate() !== dateRange[0].getDate())
        return (
          _date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) +
          ` ` +
          _date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        );
      return _date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [dateRange, from, to]
  );

  const getDate = useCallback(
    (data: MeasurementsChartLinePointType) => new Date(data.timestamp),
    []
  );
  const getValue = useCallback((data: MeasurementsChartLinePointType) => data.value, []);

  const { mouseChartX } = useMemo(() => {
    let mouseChartX: number | null = null;
    let mouseChartY: number | null = null;

    if (!chartContainerRef.current) return { mouseChartX, mouseChartY };
    const containerBoundingBox = chartContainerRef.current.getBoundingClientRect();

    mouseChartX = mouseX - containerBoundingBox.left - chartPadding.left;
    mouseChartY = mouseY - containerBoundingBox.top - chartPadding.top;

    if (
      mouseChartX < 0 ||
      mouseChartY < 0 ||
      mouseChartX > chartBoundingBox.innerWidth ||
      mouseChartY > chartBoundingBox.innerHeight
    ) {
      mouseChartX = null;
      mouseChartY = null;
    }

    return { mouseChartX, mouseChartY };
  }, [mouseX, mouseY]);

  const getLabelPosition = useCallback(
    (points: MeasurementsChartLineType['points'], index: number): 'above' | 'below' => {
      const m1 = points[index - 1]?.value
        ? (points[index]?.value - points[index - 1]?.value) /
          (+new Date(points[index]?.timestamp) - +new Date(points[index - 1]?.timestamp))
        : NaN;
      const m2 = points[index + 1]?.value
        ? (points[index + 1]?.value - points[index]?.value) /
          (+new Date(points[index + 1]?.timestamp) - +new Date(points[index]?.timestamp))
        : NaN;

      if (isNaN(m1) && isNaN(m1)) return 'above';
      if (isNaN(m1)) return m2 > 0 ? 'below' : 'above';
      if (isNaN(m2)) return m1 < 0 ? 'below' : 'above';
      return Math.abs(m1) > Math.abs(m2)
        ? m1 < 0
          ? 'below'
          : 'above'
        : m2 > 0
        ? 'below'
        : 'above';
    },
    []
  );

  // Could do bisection if more speed is needed
  const nearestPoints: NearestPointsType = useMemo(() => {
    const nearestPoints: NearestPointsType = {};

    if (mouseChartX != null) {
      const date: string = dateScale.invert(mouseChartX).toISOString();
      Object.entries(
        measurementsChart?.lines || ({} as ChartMeasurementsStateType['lines'])
      ).forEach(([key, line]) => {
        let index = 0;
        for (const point of line.points) {
          if (point.timestamp > date) {
            nearestPoints[key] = {
              above: {
                ...point,
                line: key,
                position: getLabelPosition(line.points, index),
              },
              below: {
                ...line.points[index - 1],
                line: key,
                position: getLabelPosition(line.points, index - 1),
              },
            };
            return;
          }
          index += 1;
        }
        nearestPoints[key] = {
          below: {
            ...line.points[line.points.length - 1],
            line: key,
            position: getLabelPosition(line.points, line.points.length - 1),
          },
        };
      });
    }

    return nearestPoints;
  }, [measurementsChart, mouseChartX, dateScale]);

  return (
    <LayoutGridElement>
      {filters && (setLocationIds || setMetricIds || setDeviceIds || setTags || setFrom || setTo) && (
        <FiltersContainerElement>
          {setLocationIds && (
            <Select
              label="Location"
              value={selectedLocations}
              options={locationOptions}
              onChange={selectLocations}
              isMulti
            />
          )}
          {setMetricIds && (
            <Select
              label="Metric"
              value={selectedMetrics}
              options={metricOptions}
              onChange={selectMetrics}
              isMulti
            />
          )}
          {setDeviceIds && (
            <Select
              label="Device"
              value={selectedDevices}
              options={deviceOptions}
              onChange={selectDevices}
              isMulti
            />
          )}
          {setTags && (
            <Select
              label="Tags"
              value={selectedTags}
              options={tagOptions}
              onChange={selectTags}
              isMulti
            />
          )}
          {setFrom && (
            <Input
              type="datetime-local"
              label="From"
              value={from ? toLocaleISOString(from)?.slice(0, 16) : ''}
              onChange={(event) =>
                setFrom(event.currentTarget.value ? new Date(event.currentTarget.value) : undefined)
              }
            />
          )}
          {setTo && (
            <Input
              type="datetime-local"
              label="To"
              value={to ? toLocaleISOString(to)?.slice(0, 16) : ''}
              onChange={(event) =>
                setTo(event.currentTarget.value ? new Date(event.currentTarget.value) : undefined)
              }
            />
          )}
          {setAutoReload && (
            <Checkbox
              label="Auto Reload"
              checked={autoReload}
              onChange={() => setAutoReload(!autoReload)}
            />
          )}
        </FiltersContainerElement>
      )}
      <ChartContainerElement ref={chartContainerRef}>
        {chartContainerRef.current && !!chartHeight && !!chartWidth && (
          <svg
            height={chartHeight}
            width={chartWidth}
            onMouseEnter={(event) => {
              setMouseX(event.clientX);
              setMouseY(event.clientY);
            }}
            onMouseMove={(event) => {
              setMouseX(event.clientX);
              setMouseY(event.clientY);
            }}
          >
            <RectClipPath
              id="graph-area"
              height={chartBoundingBox.innerHeight}
              width={chartBoundingBox.innerWidth}
            />
            <Group key="data-lines" clipPath="url(#graph-area)">
              {Object.entries(measurementsChart?.lines || ({} as MeasurementsChartLinesType)).map(
                ([key, line]) => (
                  <React.Fragment key={key}>
                    <LinePath<MeasurementsChartLinePointType>
                      data={line.points}
                      //   curve={curveBasis}
                      x={(data) => dateScale(getDate(data))}
                      y={(data) => metricsScales[line.metric_id](getValue(data))}
                      curve={curveMonotoneX}
                      stroke={
                        theme.colours.chartLines[line.location_id] || theme.colours.foreground
                      }
                      strokeWidth={2}
                      strokeOpacity={1}
                      defined={(data) => getValue(data) != null}
                      pointerEvents="none"
                    />
                    {/* Need to think about how I want to show points */}
                    {/* {line.points.map(
                        (point, index) =>
                          getValue(point) && (
                            <circle
                              key={`${key}:${point.timestamp}${
                                line.points?.[index - 1]?.timestamp === point.timestamp ? ':1' : ''
                              }`}
                              r={2}
                              cx={dateScale(getDate(point))}
                              cy={metricsScales[line.metric_id](getValue(point))}
                              stroke={theme.colours.foreground}
                              fill="transparent"
                            />
                          )
                      )} */}
                  </React.Fragment>
                )
              )}
            </Group>
            <Group left={chartPadding.left} top={chartPadding.top} key="graph">
              <Group key="grid-lines">
                <GridColumns
                  scale={dateScale}
                  height={chartBoundingBox.innerHeight}
                  width={chartBoundingBox.innerWidth}
                  stroke={theme.colours.border.light}
                  strokeOpacity={1}
                  pointerEvents="none"
                />
              </Group>
              <Group key="tooltips">
                {mouseChartX != null && (
                  <Line
                    from={{ x: mouseChartX, y: 0 }}
                    to={{ x: mouseChartX, y: chartBoundingBox.innerHeight }}
                    stroke={theme.colours.foreground}
                    strokeDasharray="1,3"
                    strokeWidth={1}
                    strokeOpacity={1}
                  />
                )}
                {Object.values(nearestPoints).map((nearest) => {
                  const nearestPoint = nearest.below?.value ? nearest.below : nearest.above;
                  return (
                    nearestPoint && (
                      <circle
                        key={nearestPoint.line}
                        r={5}
                        cx={dateScale(new Date(nearestPoint.timestamp))}
                        cy={metricsScales[measurementsChart?.lines[nearestPoint.line].metric_id](
                          nearestPoint.value
                        )}
                        stroke={theme.colours.background}
                        strokeWidth={3}
                        fill={
                          theme.colours.chartLines[
                            measurementsChart?.lines[nearestPoint.line].location_id
                          ] || theme.colours.foreground
                        }
                      />
                    )
                  );
                })}
              </Group>
              <Group key="axes">
                <AxisBottom
                  top={chartBoundingBox.innerHeight}
                  scale={dateScale}
                  tickFormat={dateFormatter}
                  stroke={theme.colours.foreground}
                  strokeWidth={2}
                  tickLabelProps={() => ({
                    fill: theme.colours.foreground,
                    fontSize: 12,
                    textAnchor: 'middle',
                  })}
                />
              </Group>
            </Group>
          </svg>
        )}
        {mouseChartX && (
          <MainTooltip
            style={{
              top: 0,
              left:
                mouseChartX <= 0.5 * chartBoundingBox.innerWidth
                  ? mouseChartX + chartPadding.left + 8
                  : undefined,
              right:
                mouseChartX > 0.5 * chartBoundingBox.innerWidth
                  ? chartBoundingBox.innerWidth - mouseChartX + 8
                  : undefined,
            }}
          >
            <DateHeaderElement style={{ top: 0, left: mouseChartX + chartPadding.left }}>
              {dateScale.invert(mouseChartX).toLocaleString()}
            </DateHeaderElement>
            {Object.entries(nearestPoints).map(([key, nearest], index, items) => {
              const line = measurementsChart?.lines[nearest.below?.line];
              const location = locations?.[line?.location_id];
              const metric = metrics?.[line?.metric_id];

              const [_, previousNearest] = items[index - 1] || [];
              const previousLine = measurementsChart?.lines[previousNearest?.below?.line];
              const previousLocation = locations?.[previousLine?.location_id];

              return (
                line && (
                  <React.Fragment key={key}>
                    {location?.id != previousLocation?.id && (
                      <LocationHeaderElement>
                        <LocationColourElement
                          style={{ background: theme.colours.chartLines[location.id] }}
                        />
                        {location?.name?.replace('-', ' ') || line?.location_id}
                      </LocationHeaderElement>
                    )}
                    <MetricELement>
                      {metric?.name || line?.metric_id}: {line?.tags?.join(',')}{' '}
                    </MetricELement>
                    <span>
                      {nearest.below?.value && nearest.below.value.toFixed(1) + metric?.unit}
                      {nearest.above?.value && nearest.below?.value && ' - '}
                      {nearest.above?.value && nearest.above.value.toFixed(1) + metric?.unit}
                    </span>
                  </React.Fragment>
                )
              );
            })}
          </MainTooltip>
        )}
      </ChartContainerElement>
    </LayoutGridElement>
  );
};
