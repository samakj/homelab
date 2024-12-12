/** @format */
import { CreateMetricRouteType, DeleteMetricRouteType, GetMetricRouteType, GetMetricsRouteType, UpdateMetricsRouteType } from '@/routes/metrics/types';
import { APIRequestType } from '../types';
export declare const createMetric: APIRequestType<CreateMetricRouteType>;
export declare const getMetric: APIRequestType<GetMetricRouteType>;
export declare const getMetrics: APIRequestType<GetMetricsRouteType>;
export declare const updateMetric: APIRequestType<UpdateMetricsRouteType>;
export declare const deleteMetric: APIRequestType<DeleteMetricRouteType>;
