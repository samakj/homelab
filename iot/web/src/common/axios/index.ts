/** @format */
import { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { SerialisedAxiosConfig, SerialisedAxiosResponse } from './types';

/**
 * Serailises axios request object config so that it can be passed through redux
 */
export const serialiseAxiosConfig = <
  Body = void,
  Config extends InternalAxiosRequestConfig<Body> = InternalAxiosRequestConfig<Body>,
>(
  config: Config
): SerialisedAxiosConfig<Body> => ({
  transitional: config.transitional,
  adapter: config.adapter,
  timeout: config.timeout,
  xsrfCookieName: config.xsrfCookieName,
  xsrfHeaderName: config.xsrfHeaderName,
  maxContentLength: config.maxContentLength,
  maxBodyLength: config.maxBodyLength,
  headers: config.headers?.toJSON(),
  baseURL: config.baseURL,
  method: config.method,
  url: config.url,
  data: typeof config?.data === 'string' ? JSON.parse(config.data) : config.data,
});

/**
 * Serailises axios response object so that it can be passed through redux
 */
export const serialiseAxiosResponse = <
  Data = void,
  Body = void,
  Response extends AxiosResponse<Data, Body> = AxiosResponse<Data, Body>,
>(
  response: Response
): SerialisedAxiosResponse<Data, Body> => ({
  data: response.data,
  status: response.status,
  statusText: response.statusText,
  headers: (response.headers as AxiosHeaders)?.toJSON(),
  config: serialiseAxiosConfig<Body, Response['config']>(response.config),
});
