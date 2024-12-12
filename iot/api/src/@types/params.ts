/** @format */
import { AnyArray } from './arrays';
import { AnyObject, Values } from './objects';
import { UnionToIntersection } from './unions';

export enum OperatorsEnum {
  EQ = 'eq',
  NE = 'ne',
  LT = 'lt',
  LTE = 'lte',
  GT = 'gt',
  GTE = 'gte',
  CT = 'ct',
}

export type DefaulOperatorType = OperatorsEnum.EQ;

export type ArrayOperatorsType = OperatorsEnum.CT;

export type NumberOperatorsType =
  | OperatorsEnum.EQ
  | OperatorsEnum.NE
  | OperatorsEnum.LT
  | OperatorsEnum.LTE
  | OperatorsEnum.GT
  | OperatorsEnum.GTE;

export type StringOperatorsType = OperatorsEnum.EQ | OperatorsEnum.NE;

export type KeyOperatorType<T extends AnyObject, K extends keyof T> = T[K] extends AnyArray
  ? ArrayOperatorsType
  : T[K] extends number
    ? NumberOperatorsType
    : T[K] extends string
      ? StringOperatorsType
      : DefaulOperatorType;

export type RemoveOperatorType<KeyWithOperator extends string> =
  KeyWithOperator extends `${string}[${OperatorsEnum}]`
    ? KeyWithOperator extends `${infer Key}[${OperatorsEnum}]`
      ? Key
      : never
    : KeyWithOperator;

export type QueryParamFilterKeyType<T extends AnyObject, K extends keyof T> = K extends string
  ? K | `${K}[${KeyOperatorType<T, K>}]`
  : never;

export type QueryParamFilterType<T extends AnyObject, K extends keyof T> = K extends string
  ? {
      [_K in QueryParamFilterKeyType<T, K>]: T[K] extends AnyArray
        ? NonNullable<T[K]>
        : NonNullable<T[K]>[];
    }
  : never;

export type QueryParamFiltersType<
  T extends AnyObject,
  _T extends Required<T> = Required<T>,
> = Partial<
  UnionToIntersection<
    Values<{
      [K in keyof _T]: K extends string ? QueryParamFilterType<_T, K> : never;
    }>
  >
>;
