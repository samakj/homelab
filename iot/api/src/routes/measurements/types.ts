/** @format */
import { RouteGenericInterface } from 'fastify';

import { QueryParamFiltersType } from '@/@types/params';
import { MeasurementType } from '@/models/measurement';

export interface CreateMeasurementBodyType extends Omit<MeasurementType, 'id'> {}

export interface CreateMeasurementResponseType {
  200: MeasurementType;
}

export interface CreateMeasurementRouteType extends RouteGenericInterface {
  Body: CreateMeasurementBodyType;
  Reply: CreateMeasurementResponseType;
}

export interface GetMeasurementParamsType extends Pick<MeasurementType, 'id'> {}

export interface GetMeasurementResponseType {
  200: MeasurementType;
  404: null;
}

export interface GetMeasurementRouteType extends RouteGenericInterface {
  Params: GetMeasurementParamsType;
  Reply: GetMeasurementResponseType;
}

export type GetMeasurementsQuerystringType = QueryParamFiltersType<MeasurementType>;

export interface GetMeasurementsResponseType {
  200: MeasurementType[];
}

export interface GetMeasurementsRouteType extends RouteGenericInterface {
  Querystring: GetMeasurementsQuerystringType;
  Reply: GetMeasurementsResponseType;
}

export interface UpdateMeasurementParamsType extends Pick<MeasurementType, 'id'> {}

export interface UpdateMeasurementsBodyType extends Partial<Omit<MeasurementType, 'id'>> {}

export interface UpdateMeasurementsResponseType {
  200: MeasurementType;
  404: null;
}

export interface UpdateMeasurementsRouteType extends RouteGenericInterface {
  Params: UpdateMeasurementParamsType;
  Body: UpdateMeasurementsBodyType;
  Reply: UpdateMeasurementsResponseType;
}

export interface DeleteMeasurementParamsType extends Pick<MeasurementType, 'id'> {}

export interface DeleteMeasurementResponseType {
  200: Pick<MeasurementType, 'id'>;
}

export interface DeleteMeasurementRouteType extends RouteGenericInterface {
  Params: DeleteMeasurementParamsType;
  Reply: DeleteMeasurementResponseType;
}
