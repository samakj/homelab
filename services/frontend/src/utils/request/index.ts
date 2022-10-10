/** @format */

import {
  AsyncThunk,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NullSafeMerge } from '../../types';
import { Url } from '../url';
import { DefaultParamsType, DefaultPathParamsType } from '../url/types';

type FetchRequestOptions = RequestInit;
export interface RequestOptions extends FetchRequestOptions {
  raiseFor?: {
    // For direct status code control ie 400
    [statusCode: number]: boolean;
    // For group status code control ie 4xx
    [statusCode: string]: boolean;
  };
}

export type HttpResponseStatusGroups = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

type FetchResponse = Response;
export interface HttpResponse extends FetchResponse {
  statusGroup: HttpResponseStatusGroups;
  urlTemplate: string;
  options?: RequestOptions;
}

export interface SerialisedHttpError {
  message: string;
  name: string;
  status: number;
  statusGroup: string;
  json: any;
}

export interface HttpErrorPayload {
  error?: SerialisedHttpError;
}

export class HttpError extends Error {
  response: HttpResponse;
  data?: string | Record<string, unknown>;

  constructor(response: HttpResponse, data?: string | Record<string, unknown>) {
    super(`HTTP ${response.status} returned by ${response.url}`);
    this.response = response;
    this.data = data;
  }

  async serialise(): Promise<SerialisedHttpError> {
    if (!this.data) {
      try {
        this.data = await this.response.json();
      } catch {
        // pass
      }
    }

    return {
      message: this.message,
      name: this.name,
      status: this.response.status,
      statusGroup: this.response.statusGroup,
      json: this.data,
    };
  }
}

export class Request<
  PathParamsType extends DefaultPathParamsType | null,
  ParamsType extends DefaultParamsType | null
> {
  url: Url<PathParamsType, ParamsType>;
  options: RequestOptions;

  constructor(url: Url<PathParamsType, ParamsType>, options: RequestOptions = {}) {
    this.url = url;
    this.options = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  async fetch(params: NullSafeMerge<PathParamsType, ParamsType>, options: RequestOptions = {}) {
    const url = this.url.build(params);
    const { raiseFor, ..._options } = {
      ...this.options,
      ...options,
      raiseFor: { ...this.options.raiseFor, ...options.raiseFor },
    };
    // @ts-ignore
    return fetch(url, _options).then((response: HttpResponse) => {
      response.options = { ..._options, raiseFor };
      response.urlTemplate = this.url.template;
      response.statusGroup = `${response.status.toString()[0]}xx` as HttpResponseStatusGroups;

      let raise = !response.ok;
      if (response?.options?.raiseFor != null) {
        if (response?.options?.raiseFor[response.statusGroup] != null)
          raise = response?.options.raiseFor[response.statusGroup];
        if (response?.options?.raiseFor[response.status] != null)
          raise = response?.options.raiseFor[response.status];
      }
      if (raise) throw new HttpError(response);
      return response;
    });
  }

  async get(
    params: NullSafeMerge<PathParamsType, ParamsType>,
    options: RequestOptions = {}
  ): Promise<HttpResponse> {
    return await this.fetch(params, { ...options });
  }

  async patch(
    params: NullSafeMerge<PathParamsType, ParamsType>,
    data: {} = {},
    options: RequestOptions = {}
  ): Promise<HttpResponse> {
    return await this.fetch(params, { ...options, method: 'PATCH', body: JSON.stringify(data) });
  }

  async post(
    params: NullSafeMerge<PathParamsType, ParamsType>,
    data: {} = {},
    options: RequestOptions = {}
  ): Promise<HttpResponse> {
    return await this.fetch(params, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  async delete(
    params: NullSafeMerge<PathParamsType, ParamsType>,
    data: {} = {},
    options: RequestOptions = {}
  ): Promise<HttpResponse> {
    return await this.fetch(params, { ...options, method: 'DELETE', body: JSON.stringify(data) });
  }
}

export const createRequestThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, {}>,
  options?: AsyncThunkOptions<ThunkArg, {}>
): AsyncThunk<Returned, ThunkArg, {}> =>
  createAsyncThunk<Returned, ThunkArg>(
    typePrefix,
    async (arg, api) =>
      payloadCreator(arg, api).catch(async (error) => {
        if (error instanceof HttpError) return api.rejectWithValue(await error.serialise());
        throw error;
      }),
    options
  );
