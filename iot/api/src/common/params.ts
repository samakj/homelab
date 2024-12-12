/** @format */
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

import { AnyObject } from '@/@types/objects';
import {
  ArrayOperatorsType,
  DefaulOperatorType,
  KeyOperatorType,
  NumberOperatorsType,
  OperatorsEnum,
  RemoveOperatorType,
  StringOperatorsType,
} from '@/@types/params';

export const DEFAULT_OPERATOR: DefaulOperatorType = OperatorsEnum.EQ;

export const DEFAULT_ARRAY_OPERATOR: ArrayOperatorsType = OperatorsEnum.CT;
export const ARRAY_OPERATORS: Set<ArrayOperatorsType> = new Set([OperatorsEnum.CT]);
export const isArrayOperator = (operator: string): operator is ArrayOperatorsType =>
  ARRAY_OPERATORS.has(operator as ArrayOperatorsType);

export const DEFAULT_NUMBER_OPERATOR: NumberOperatorsType = OperatorsEnum.EQ;
export const NUMBER_OPERATORS: Set<NumberOperatorsType> = new Set([
  OperatorsEnum.EQ,
  OperatorsEnum.NE,
  OperatorsEnum.LT,
  OperatorsEnum.LTE,
  OperatorsEnum.GT,
  OperatorsEnum.GTE,
]);
export const isNumberOperator = (operator: string): operator is NumberOperatorsType =>
  NUMBER_OPERATORS.has(operator as NumberOperatorsType);

export const DEFAULT_STRING_OPERATOR: StringOperatorsType = OperatorsEnum.EQ;
export const STRING_OPERATORS: Set<StringOperatorsType> = new Set([
  OperatorsEnum.EQ,
  OperatorsEnum.NE,
]);
export const isStringOperator = (operator: string): operator is StringOperatorsType =>
  STRING_OPERATORS.has(operator as StringOperatorsType);

export const applyOperatorToParamName = (name: string, operator: OperatorsEnum) =>
  `${name}[${operator}]`;

export const extractOperatorFromParamName = <
  TypeName extends JSONSchema7TypeName,
  Operator extends OperatorsEnum = TypeName extends 'array'
    ? ArrayOperatorsType
    : TypeName extends 'number'
      ? NumberOperatorsType
      : TypeName extends 'string'
        ? StringOperatorsType
        : DefaulOperatorType,
>(
  name: string,
  schemaType?: TypeName
): {
  name: string;
  operator: Operator;
} => {
  const nameSplit = name.split('[');
  const rawOperator = nameSplit[1]?.replace(']', '');

  if (schemaType === 'array') {
    return {
      name: nameSplit[0],
      operator: (rawOperator && isArrayOperator(rawOperator)
        ? rawOperator
        : DEFAULT_ARRAY_OPERATOR) as Operator,
    };
  }
  if (schemaType === 'string') {
    return {
      name: nameSplit[0],
      operator: (rawOperator && isStringOperator(rawOperator)
        ? rawOperator
        : DEFAULT_STRING_OPERATOR) as Operator,
    };
  }
  if (schemaType === 'number') {
    return {
      name: nameSplit[0],
      operator: (rawOperator && isNumberOperator(rawOperator)
        ? rawOperator
        : DEFAULT_NUMBER_OPERATOR) as Operator,
    };
  }

  return { name: nameSplit[0], operator: DEFAULT_OPERATOR as Operator };
};

export const extractOperatorsFromQueryParams = <
  Params extends AnyObject,
  ParsedParams = {
    [Key in keyof Params]: Key extends string
      ? {
          name: RemoveOperatorType<Key>;
          value: Params[Key];
          operator: KeyOperatorType<Params, Key>;
        }
      : never;
  },
>(
  queryParams?: Params,
  schema?: JSONSchema7
): ParsedParams =>
  Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
    const nameSplit = key.split('[');
    // @ts-ignore
    acc[key as keyof Params] = {
      // @ts-ignore
      ...extractOperatorFromParamName(key, schema?.properties?.[nameSplit[0]]?.type),
      value,
    };
    return acc;
  }, {} as ParsedParams);
