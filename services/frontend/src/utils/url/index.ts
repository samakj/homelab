/** @format */

import { NullSafeMerge } from '../../types';
import {
  DefaultPathParamsType,
  isArrayParamType,
  isParamWithOperator,
  DefaultParamsType,
  ParamValueType,
  PrimitiveParamValueType,
  ParamWithOperatorType,
  ArrayParamValueType,
} from './types';

export class Url<
  PathParamsType extends DefaultPathParamsType | null = null,
  ParamsType extends DefaultParamsType | null = null
> {
  template: string;

  constructor(template: string) {
    this.template = template;
  }

  static serialiseValue = (value?: PrimitiveParamValueType): string | undefined => {
    if (value instanceof Date) value = value.toISOString();
    return value?.toString();
  };

  static buildParamValue = (
    value?: PrimitiveParamValueType | ParamWithOperatorType
  ): string | undefined => {
    if (value == null) return undefined;
    if (isParamWithOperator(value)) {
      return `${value.operator}:${Url.serialiseValue(value.value)}`;
    }
    return Url.serialiseValue(value);
  };

  static buildArrayParamValue = (
    value?: ArrayParamValueType
  ): (string | undefined)[] | undefined => {
    if (value == null) return undefined;
    return value.map(Url.buildParamValue);
  };

  static addParam = (
    urlSearchParams: URLSearchParams,
    key: string,
    value: ParamValueType
  ): URLSearchParams => {
    if (value == null) return urlSearchParams;

    if (isArrayParamType(value)) {
      const serialisedValues = Url.buildArrayParamValue(value);
      serialisedValues?.forEach((item) => {
        if (item != null) urlSearchParams.append(key, item);
      });
    } else {
      const serialisedValue = Url.buildParamValue(value);
      if (serialisedValue) urlSearchParams.append(key, serialisedValue);
    }

    return urlSearchParams;
  };

  static buildParams = (params?: DefaultParamsType | null | undefined): URLSearchParams => {
    const urlSearchParams = new URLSearchParams();

    if (params == null) return urlSearchParams;

    Object.entries(params).forEach(([key, value]): void => {
      Url.addParam(urlSearchParams, key, value as ParamValueType);
    });

    return urlSearchParams;
  };

  buildPath = (params?: PathParamsType): string => {
    if (params == null) return this.template;

    let path = this.template;
    Object.entries(params).forEach(([key, value]): void => {
      path = path.replaceAll(`:${key}`, Url.buildParamValue(value as PrimitiveParamValueType));
    });

    if (!path.endsWith('/')) path += '/';

    return path;
  };

  build(pathParams?: NullSafeMerge<PathParamsType, ParamsType>, params?: ParamsType) {
    const serialisedParams = Url.buildParams(params || pathParams);
    let paramsString = '';
    if (Array.from(serialisedParams).length) {
      paramsString = `?${params}`;
    }
    return `${this.buildPath(pathParams)}${paramsString.replaceAll('%3A', ':')}`;
  }
}
