/** @format */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiValue } from 'react-select';
import { DeviceType } from '../../store/slices/devices/types';
import { LocationType } from '../../store/slices/locations/types';
import {
  MeasurementsStateType,
  MeasurementType,
  ValueTypeEnum,
} from '../../store/slices/measurements/types';
import { MetricType } from '../../store/slices/metrics/types';
import { ExtendedSet } from '../../utils/set';
import { Select } from '../select';
import {
  FiltersContainerElement,
  ChartContainerElement,
  LayoutGridElement,
  DateTooltip,
  PointValueTooltip,
} from './elements';
import {
  LinesType,
  MeasurementChartPropsType,
  MetricRangesType,
  NearestPointsType,
  RangesType,
  ScalesType,
} from './types';
import { Input } from '../input';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridRows, GridColumns } from '@visx/grid';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { curveBasis } from '@visx/curve';
import { LinePath, Line, Polygon } from '@visx/shape';
import { Group } from '@visx/group';
import { RectClipPath } from '@visx/clip-path';
import { Text } from '@visx/text';
import { useTheme } from 'styled-components';

const generateLineKey = (measurement: MeasurementType): string =>
  `${measurement.location_id}:${measurement.metric_id}:` +
  `${measurement.tags.join(',')}:${measurement.device_id}`;

const getMetricIdFromKey = (key: string): number => parseInt(key.split(':')[1]);

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
  measurements,
  locations,
  devices,
  metrics,
  filters = true,
}) => {
  const theme = useTheme();
  const filteredMeasurements: MeasurementsStateType = useMemo(
    () =>
      Object.values(measurements || {}).reduce(
        (acc: MeasurementsStateType, measurement: MeasurementType) => {
          if (locationIds.size && !locationIds.has(measurement.location_id)) return acc;
          if (metricIds.size && !metricIds.has(measurement.metric_id)) return acc;
          if (deviceIds.size && !deviceIds.has(measurement.device_id)) return acc;
          if (tags.size && tags.find((tag) => !measurement.tags.includes(tag))) return acc;
          if (from != null && new Date(measurement.timestamp) < from) return acc;
          if (to != null && new Date(measurement.timestamp) > to) return acc;
          acc[measurement.id] = measurement;
          return acc;
        },
        {}
      ),
    [measurements, locationIds, metricIds, deviceIds, tags, from, to]
  );

  const sortedMeasurements: MeasurementType[] = useMemo(
    () =>
      Object.values(filteredMeasurements).sort(
        (measurementA: MeasurementType, measurementB: MeasurementType) => {
          if (measurementA.timestamp > measurementB.timestamp) return 1;
          if (measurementA.timestamp < measurementB.timestamp) return -1;
          return 0;
        }
      ),
    [filteredMeasurements]
  );

  const locationOptions = useMemo(
    () =>
      Object.values(locations || {}).map((location: LocationType) => ({
        value: location.id,
        label: location.name,
      })),
    [locations]
  );

  const selectedLocations = useMemo(
    () => locationOptions.filter((option) => locationIds.has(option.value)),
    [locationOptions, locationIds]
  );

  const selectLocations = useCallback(
    (options?: MultiValue<typeof locationOptions[number]>) => {
      const locations =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<LocationType['id']>()) || new ExtendedSet<LocationType['id']>();
      setLocationIds(locations);
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
    () => deviceOptions.filter((option) => deviceIds.has(option.value)),
    [deviceOptions, deviceIds]
  );

  const selectDevices = useCallback(
    (options?: MultiValue<typeof locationOptions[number]>) => {
      const locations =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<LocationType['id']>()) || new ExtendedSet<LocationType['id']>();
      setDeviceIds(locations);
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
    () => metricOptions.filter((option) => metricIds.has(option.value)),
    [metricOptions, metricIds]
  );

  const selectMetrics = useCallback(
    (options?: MultiValue<typeof metricOptions[number]>) => {
      const metrics =
        options?.reduce((acc, option) => {
          acc.add(option.value);
          return acc;
        }, new ExtendedSet<MetricType['id']>()) || new ExtendedSet<MetricType['id']>();
      setMetricIds(metrics);
    },
    [setMetricIds]
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
    () => tagOptions.filter((option) => tags.has(option.value)),
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
      setTags(tags);
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
        setChartHeight(element.contentRect.height - 1);
        setChartWidth(element.contentRect.width - 1);
      }, 100);
    })
  );

  useEffect(() => {
    const observer = observerRef.current;
    if (chartContainerRef.current) observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, [chartContainerRef, observerRef]);

  const { dateRange, metricRanges }: RangesType = useMemo(() => {
    const dateRange = [from ? from.toISOString() : '9999', to ? to.toISOString() : '2000'];
    const metricRanges: MetricRangesType = {};

    sortedMeasurements.forEach((measurement) => {
      if (typeof measurement.value !== 'number') return;
      if (measurement.timestamp < dateRange[0]) dateRange[0] = measurement.timestamp;
      if (measurement.timestamp > dateRange[1]) dateRange[1] = measurement.timestamp;
      if (!metricRanges[measurement.metric_id])
        metricRanges[measurement.metric_id] = [measurement.value, measurement.value];
      else if (measurement.value < metricRanges[measurement.metric_id][0])
        metricRanges[measurement.metric_id][0] = measurement.value;
      else if (measurement.value > metricRanges[measurement.metric_id][1])
        metricRanges[measurement.metric_id][1] = measurement.value;
    });

    return {
      dateRange: [+new Date(dateRange[0]), +new Date(dateRange[1])],
      metricRanges: Object.entries(metricRanges).reduce((acc, [metricId, metricRange]) => {
        acc[metricId] = [
          metricRange[1] * (1 + 0.1 * Math.sign(metricRange[1])),
          metricRange[0] * (1 - 0.1 * Math.sign(metricRange[0])),
        ];
        return acc;
      }, {}),
    };
  }, [sortedMeasurements, from, to]);

  const { dateScale, metricScales }: ScalesType = useMemo(
    () => ({
      dateScale: scaleTime({ range: [0, chartBoundingBox.innerWidth], domain: dateRange }),
      metricScales: Object.entries(metricRanges).reduce((acc, [metricId, metricRange]) => {
        acc[metricId] = scaleLinear({
          range: [0, chartBoundingBox.innerHeight],
          domain: metricRange,
        });
        return acc;
      }, {}),
    }),
    [dateRange, metricRanges]
  );

  const dateFormatter = useCallback(
    (date: unknown) => {
      if (
        dateRange[0] !== dateRange[1] &&
        new Date(+(date as Date)).toISOString().slice(11, 19) === '00:00:00'
      )
        return new Date(+(date as Date)).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        });
      return new Date(+(date as Date)).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      });
    },
    [dateRange, from, to]
  );

  const getDate = useCallback((data: MeasurementType) => new Date(data.timestamp), []);
  const getValue = useCallback((data: MeasurementType) => data.value, []);

  const lines: LinesType = useMemo(
    () =>
      sortedMeasurements.reduce((acc, measurement) => {
        const key = generateLineKey(measurement);
        if (!acc[key]) acc[key] = [];
        acc[key].push(measurement);
        return acc;
      }, {}),
    [sortedMeasurements]
  );

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
    (
      points: MeasurementType<ValueTypeEnum.FLOAT | ValueTypeEnum.INTEGER>[],
      index: number
    ): 'above' | 'below' => {
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
      Object.entries(lines).forEach(([key, points]) => {
        let index = 0;
        for (const point of points) {
          if (point.timestamp > date) {
            nearestPoints[key] = {
              above: { ...point, position: getLabelPosition(points, index) },
              below: { ...points[index - 1], position: getLabelPosition(points, index - 1) },
            };
            return;
          }
          index += 1;
        }
        nearestPoints[key] = {
          below: {
            ...points[points.length - 1],
            position: getLabelPosition(points, points.length - 1),
          },
        };
      });
    }

    return nearestPoints;
  }, [lines, mouseChartX, dateScale]);

  return (
    <LayoutGridElement>
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
            label="Device"
            value={selectedDevices}
            options={deviceOptions}
            onChange={selectDevices}
            isMulti
          />
          <Select
            label="Tags"
            value={selectedTags}
            options={tagOptions}
            onChange={selectTags}
            isMulti
          />
          <Input
            type="datetime-local"
            label="From"
            value={from?.toISOString()?.slice(0, 16) || ''}
            onChange={(event) =>
              setFrom(event.currentTarget.value ? new Date(event.currentTarget.value) : undefined)
            }
          />
          <Input
            type="datetime-local"
            label="To"
            value={to?.toISOString()?.slice(0, 16) || ''}
            onChange={(event) =>
              setTo(event.currentTarget.value ? new Date(event.currentTarget.value) : undefined)
            }
          />
        </FiltersContainerElement>
      )}
      <ChartContainerElement ref={chartContainerRef}>
        {!!chartHeight && !!chartWidth && (
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
                  <>
                    <Line
                      from={{ x: mouseChartX, y: 0 }}
                      to={{ x: mouseChartX, y: chartBoundingBox.innerHeight }}
                      stroke={theme.colours.foreground}
                      strokeDasharray="1,3"
                      strokeWidth={1}
                      strokeOpacity={1}
                    />
                  </>
                )}
              </Group>
              <Group key="data-lines" clipPath="url(#graph-area)">
                {Object.entries(lines).map(([key, points]) => (
                  <React.Fragment key={key}>
                    <LinePath<MeasurementType>
                      data={points}
                      //   curve={curveBasis}
                      x={(data) => dateScale(getDate(data))}
                      y={(data) => metricScales[getMetricIdFromKey(key)](getValue(data))}
                      stroke={theme.colours.foreground}
                      strokeWidth={1}
                      strokeOpacity={1}
                      defined={(data) => getValue(data) != null}
                      pointerEvents="none"
                    />
                    {points.map(
                      (measurement, index) =>
                        getValue(measurement) && (
                          <circle
                            key={`${key}:${measurement.timestamp}${
                              points?.[index - 1]?.timestamp === measurement.timestamp ? ':1' : ''
                            }`}
                            r={2}
                            cx={dateScale(getDate(measurement))}
                            cy={metricScales[getMetricIdFromKey(key)](getValue(measurement))}
                            stroke={theme.colours.foreground}
                            fill="transparent"
                          />
                        )
                    )}
                  </React.Fragment>
                ))}
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
                {/* <AxisLeft scale={priceScale} /> */}
              </Group>
            </Group>
          </svg>
        )}
        {mouseChartX != null && (
          <DateTooltip style={{ top: 0, left: mouseChartX + chartPadding.left }}>
            {dateScale.invert(mouseChartX).toLocaleString()}
          </DateTooltip>
        )}
        {Object.entries(nearestPoints).map(([key, nearest]) => (
          <React.Fragment key={key}>
            {nearest.below && metricScales[nearest.below.metric_id] && (
              <PointValueTooltip
                style={{
                  top:
                    metricScales[nearest.below.metric_id](nearest.below.value) + chartPadding.top,
                  left: dateScale(new Date(nearest.below.timestamp)) + chartPadding.left,
                }}
                position={nearest.below.position}
              >
                {nearest.below.value}
                {metrics?.[nearest.below.metric_id]?.unit}
              </PointValueTooltip>
            )}
            {nearest.above && metricScales[nearest.above.metric_id] && (
              <PointValueTooltip
                style={{
                  top:
                    metricScales[nearest.above.metric_id](nearest.above.value) + chartPadding.top,
                  left: dateScale(new Date(nearest.above.timestamp)) + chartPadding.left,
                }}
                position={nearest.above.position}
              >
                {nearest.above.value}
                {metrics?.[nearest.above.metric_id]?.unit}
              </PointValueTooltip>
            )}
          </React.Fragment>
        ))}
      </ChartContainerElement>
    </LayoutGridElement>
  );
};
