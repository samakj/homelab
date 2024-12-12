/** @format */
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Any } from '@/types';

export const useAction = <Action extends ActionCreatorWithPayload<Any, string>>(action: Action) => {
  const dispatch = useDispatch();
  const _action = useCallback(
    (arg: Parameters<Action>[0]) => dispatch(action(arg)),
    [dispatch, action]
  );
  return _action;
};
