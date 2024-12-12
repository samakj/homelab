/** @format */
import { Any } from '@/@types/any';
import { OperatorsEnum } from '@/@types/params';
import { FiltersType } from '@/stores/types';

export const makePostgresFilterValue = (value: Any): string => {
  if (Array.isArray(value)) {
    return `(${value.map(makePostgresFilterValue).join(',')})`;
  }

  const valueType = typeof value;

  if (valueType == 'boolean') {
    return `${value}`;
  }
  if (valueType == 'number') {
    return `${value}`;
  }
  if (value instanceof Date) {
    return `${+value}`;
  }

  return `'${value}'`;
};

export const makePostgresFilter = (filter: FiltersType[number]) => {
  if (filter.operator === OperatorsEnum.EQ) {
    return `${filter.name} IN ${makePostgresFilterValue(filter.value)}`;
  }
  if (filter.operator === OperatorsEnum.NE) {
    return `${filter.name} NOT IN ${makePostgresFilterValue(filter.value)}`;
  }
  if (filter.operator === OperatorsEnum.LT) {
    return `(${filter.value
      .map((value: Any) => `${filter.name} < ${makePostgresFilterValue(value)}`)
      .join(' OR ')})`;
  }
  if (filter.operator === OperatorsEnum.LTE) {
    return `(${filter.value
      .map((value: Any) => `${filter.name} <= ${makePostgresFilterValue(value)}`)
      .join(' OR ')})`;
  }
  if (filter.operator === OperatorsEnum.GT) {
    return `(${filter.value
      .map((value: Any) => `${filter.name} > ${makePostgresFilterValue(value)}`)
      .join(' OR ')})`;
  }
  if (filter.operator === OperatorsEnum.GTE) {
    return `(${filter.value
      .map((value: Any) => `${filter.name} >= ${makePostgresFilterValue(value)}`)
      .join(' OR ')})`;
  }
  if (filter.operator === OperatorsEnum.CT) {
    return `${filter.name} @> ${makePostgresFilterValue(filter.value)}`;
  }

  return `${filter.name} = ${makePostgresFilterValue(filter.value)}`;
};
