/** @format */

export enum OpertatorsEnum {
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  EQUALS = 'eq',
  LESS_THAN_OR_EQUAL = 'lte',
  LESS_THAN = 'lt',
}

export type PrimitiveParamValueType = string | number | boolean | Date | undefined;

export interface ParamWithOperatorType<
  T extends PrimitiveParamValueType = PrimitiveParamValueType
> {
  value: T;
  operator: OpertatorsEnum;
}

export const isParamWithOperator = (
  value: PrimitiveParamValueType | ParamWithOperatorType
): value is ParamWithOperatorType => {
  return typeof value === 'object' && !(value instanceof Date);
};

export type ArrayParamValueType<T extends PrimitiveParamValueType = PrimitiveParamValueType> =
  | T[]
  | ParamWithOperatorType<T>[];

export const isArrayParamType = <T extends PrimitiveParamValueType = PrimitiveParamValueType>(
  value: ParamValueType<T>
): value is ArrayParamValueType<T> => Array.isArray(value);

export type ParamValueType<T extends PrimitiveParamValueType = PrimitiveParamValueType> =
  | T
  | ArrayParamValueType<T>;

export type DefaultParamsType = {};

export type DefaultPathParamsType = {};
