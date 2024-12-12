/** @format */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { APIRequestType } from '@/apis/iot/types';
import { Any } from '@/types';

import { serialiseAxiosResponse } from '../axios';

export const createAxiosThunk = <
  Request extends APIRequestType<Any>,
  Options = Parameters<Request>[0],
  Body = NonNullable<Awaited<ReturnType<Request>>['config']['data']>,
  Response = NonNullable<Awaited<ReturnType<Request>>['data']>,
>(
  typePrefix: string,
  request: Request
) =>
  createAsyncThunk(typePrefix, (options: Options) =>
    request(options).then((response) => serialiseAxiosResponse<Response, Body>(response))
  );
