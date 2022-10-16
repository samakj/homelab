/** @format */

import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forceUTCTimestamp } from '../../../utils';
import { deepSetIfNullish } from '../../../utils/deep';
import { initialRequestMeta } from '../types';
import {
  createMeasurement,
  getMeasurement,
  getMeasurementsLatest,
  getMeasurements,
  getMeasurementsChart,
} from './thunks';
import { MeasurementsSliceType, MeasurementType, ValueTypeEnum } from './types';
import {
  CreateMeasurementMessageAction,
  // DeleteMeasurementMessageAction,
  // UpdateMeasurementMessageAction,
} from './websocket';

export const initialState: MeasurementsSliceType = {
  requests: {
    getMeasurement: initialRequestMeta,
    getMeasurementsLatest: initialRequestMeta,
    getMeasurementsChart: initialRequestMeta,
    getMeasurements: initialRequestMeta,
    createMeasurement: initialRequestMeta,
  },
  latest: undefined,
  measurements: undefined,
  chart: undefined,
};

const serialiseTags = (tags: string[]): string => [...tags].sort().join(',');

export const setMeasurements = (
  state: MeasurementsSliceType,
  action: Pick<PayloadAction<MeasurementType | MeasurementType[]>, 'payload'>
) => {
  state.measurements = state.measurements || {};
  if (Array.isArray(action.payload))
    action.payload.forEach((measurement) => setMeasurements(state, { payload: measurement }));
  else {
    state.measurements[action.payload.id] =
      action.payload.value_type == ValueTypeEnum.FLOAT
        ? {
            ...action.payload,
            // @ts-ignore: floats come though as strings for json safety
            value: parseFloat(action.payload.value),
          }
        : action.payload;
    state.measurements[action.payload.id].timestamp = forceUTCTimestamp(
      state.measurements[action.payload.id].timestamp
    );
  }
};

export const setLatestMeasurements = (
  state: MeasurementsSliceType,
  action: Pick<PayloadAction<MeasurementType | MeasurementType[]>, 'payload'>
) => {
  const measurements = Array.isArray(action.payload) ? action.payload : [action.payload];
  measurements.forEach((measurement) => {
    state.latest = state.latest || {};
    const serialisedTags = serialiseTags(measurement.tags);
    deepSetIfNullish(state.latest, [measurement.location_id], { count: 0, children: {} });
    deepSetIfNullish(state.latest, [measurement.location_id, 'children', measurement.metric_id], {
      count: 0,
      children: {},
    });
    deepSetIfNullish(
      state.latest,
      [measurement.location_id, 'children', measurement.metric_id, 'children', serialisedTags],
      { count: 0, children: {} }
    );

    if (
      state.latest[measurement.location_id].children[measurement.metric_id].children[serialisedTags]
        .children[measurement.device_id] === undefined
    ) {
      state.latest[measurement.location_id].count += 1;
      state.latest[measurement.location_id].children[measurement.metric_id].count += 1;
      state.latest[measurement.location_id].children[measurement.metric_id].children[
        serialisedTags
      ].count += 1;
    }
    state.latest[measurement.location_id].children[measurement.metric_id].children[
      serialisedTags
    ].children[measurement.device_id] = measurement.id;
  });
};

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: { setMeasurements, setLatestMeasurements },
  extraReducers: (builder: ActionReducerMapBuilder<MeasurementsSliceType>): void => {
    builder
      .addCase(getMeasurement.pending, (state, action) => {
        state.requests.getMeasurement.isLoading = true;
        state.requests.getMeasurement.started = new Date().toISOString();
      })
      .addCase(getMeasurement.fulfilled, (state, action) => {
        setMeasurements(state, action);
        state.requests.getMeasurement.isLoading = false;
        state.requests.getMeasurement.finished = new Date().toISOString();
      })
      .addCase(getMeasurement.rejected, (state, action) => {
        state.requests.getMeasurement.error = action.payload || action.error;
        state.requests.getMeasurement.isLoading = false;
        state.requests.getMeasurement.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.pending, (state, action) => {
        state.requests.getMeasurementsLatest.isLoading = true;
        state.requests.getMeasurementsLatest.started = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.fulfilled, (state, action) => {
        setMeasurements(state, action);
        setLatestMeasurements(state, action);
        state.requests.getMeasurementsLatest.isLoading = false;
        state.requests.getMeasurementsLatest.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsLatest.rejected, (state, action) => {
        state.requests.getMeasurementsLatest.error = action.payload || action.error;
        state.requests.getMeasurementsLatest.isLoading = false;
        state.requests.getMeasurementsLatest.finished = new Date().toISOString();
      })
      .addCase(getMeasurements.pending, (state, action) => {
        state.requests.getMeasurements.isLoading = true;
        state.requests.getMeasurements.started = new Date().toISOString();
      })
      .addCase(getMeasurements.fulfilled, (state, action) => {
        setMeasurements(state, action);
        state.requests.getMeasurements.isLoading = false;
        state.requests.getMeasurements.finished = new Date().toISOString();
      })
      .addCase(getMeasurements.rejected, (state, action) => {
        state.requests.getMeasurements.error = action.payload || action.error;
        state.requests.getMeasurements.isLoading = false;
        state.requests.getMeasurements.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsChart.pending, (state, action) => {
        state.requests.getMeasurementsChart.isLoading = true;
        state.requests.getMeasurementsChart.started = new Date().toISOString();
      })
      .addCase(getMeasurementsChart.fulfilled, (state, action) => {
        state.chart = action.payload;
        state.chart.timestamp.min =
          state.chart.timestamp.min && forceUTCTimestamp(state.chart.timestamp.min);
        state.chart.timestamp.max =
          state.chart.timestamp.max && forceUTCTimestamp(state.chart.timestamp.max);
        Object.keys(state.chart.lines).forEach((lineKey) =>
          state.chart?.lines[lineKey].points.forEach(
            (_, index) =>
              state.chart &&
              (state.chart.lines[lineKey].points[index].timestamp = forceUTCTimestamp(
                state.chart.lines[lineKey].points[index].timestamp
              ))
          )
        );
        state.requests.getMeasurementsChart.isLoading = false;
        state.requests.getMeasurementsChart.finished = new Date().toISOString();
      })
      .addCase(getMeasurementsChart.rejected, (state, action) => {
        state.requests.getMeasurementsChart.error = action.payload || action.error;
        state.requests.getMeasurementsChart.isLoading = false;
        state.requests.getMeasurementsChart.finished = new Date().toISOString();
      })
      .addCase(createMeasurement.pending, (state, action) => {
        state.requests.createMeasurement.isLoading = true;
        state.requests.createMeasurement.started = new Date().toISOString();
      })
      .addCase(createMeasurement.fulfilled, (state, action) => {
        setMeasurements(state, action);
        state.requests.createMeasurement.isLoading = false;
        state.requests.createMeasurement.finished = new Date().toISOString();
      })
      .addCase(createMeasurement.rejected, (state, action) => {
        state.requests.createMeasurement.error = action.payload || action.error;
        state.requests.createMeasurement.isLoading = false;
        state.requests.createMeasurement.finished = new Date().toISOString();
      })
      .addCase(CreateMeasurementMessageAction, (state, action) => {
        setMeasurements(state, { payload: action.payload.measurement });
        setLatestMeasurements(state, { payload: action.payload.measurement });
      });
    // Don't currently exist as possibilities
    // .addCase(UpdateMeasurementMessageAction, (state, action) => {
    //   setMeasurements(state, { payload: action.payload.measurement });
    // })
    // .addCase(DeleteMeasurementMessageAction, (state, action) => {
    //   if (state.measurements) delete state.measurements[action.payload.measurement.id];
    // });
  },
});
