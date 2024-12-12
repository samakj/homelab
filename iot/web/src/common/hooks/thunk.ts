/** @format */
import { AsyncThunk } from '@reduxjs/toolkit';
import { useCallback, useEffect, useMemo } from 'react';

import { Any, NonNullableKeys } from '@/types';

import { useDispatch } from '../../store';

export const useAsyncThunk = <
  Options extends { [key: string]: AsyncThunk<Any, Any, Any> } = {
    [key: string]: AsyncThunk<Any, Any, Any>;
  },
  ThunkArg = Parameters<Options[keyof Options]>[0],
  Callback = NonNullableKeys<NonNullable<ThunkArg>> extends never
    ? (args?: ThunkArg) => Promise<ReturnType<Options[keyof Options]>>
    : (args: ThunkArg) => Promise<ReturnType<Options[keyof Options]>>,
>(
  options: Options
) => {
  const dispatch = useDispatch();
  const key = useMemo(() => Object.keys(options)[0], [options]);
  const thunk = useMemo(() => options[key], [options, key]);

  const callback = useCallback((args: ThunkArg) => dispatch(thunk(args)), [dispatch, thunk]);

  useEffect(() => {
    if (Object.keys(options).length !== 1) {
      console.error('useAsyncThunk called with more than one key: ', options);
    }
  }, [options]);

  return { [key]: callback } as { [key in keyof Options]: Callback };
};
