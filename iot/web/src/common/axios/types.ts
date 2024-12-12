/** @format */
import { AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export interface SerialisedAxiosConfig<Body = void>
  extends Omit<InternalAxiosRequestConfig<Body>, 'headers'> {
  headers: RawAxiosRequestHeaders;
  data: Body;
}

export interface SerialisedAxiosResponse<Data = void, Body = void>
  extends Omit<AxiosResponse<Data, Body>, 'headers' | 'config'> {
  headers: RawAxiosRequestHeaders;
  config: SerialisedAxiosConfig<Body>;
}
