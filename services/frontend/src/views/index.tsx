/** @format */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useDispatch } from '../store';
import { checkToken, login } from '../store/slices/authorisation/thunks';

export const Index: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const access_token = useSelector((state: RootState) => state.authorisation.access_token);

  useEffect(() => {
    dispatch(login({ username: 'test', password: 'password' }));
  }, [dispatch]);
  useEffect(() => {
    if (access_token) dispatch(checkToken({ access_token }));
  }, [access_token, dispatch]);

  return <div>Hello</div>;
};
