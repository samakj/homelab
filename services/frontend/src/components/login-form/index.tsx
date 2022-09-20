/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { authorisationSlice } from '../../store/slices/authorisation/slice';
import { checkToken, login } from '../../store/slices/authorisation/thunks';
import { useDispatch, useSelector } from '../../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../input';
import {
  LoginFormWrapperElement,
  LoginFormElement,
  TitleElement,
  LoginFormContainerElement,
  ButtonElement,
  ErrorElement,
} from './elements';
import { LoginResponseType } from '../../store/slices/authorisation/types';

export const LoginForm: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginLoading = useSelector((state) => state.authorisation.requests.login.isLoading);
  const loginError = useSelector((state) => state.authorisation.requests.login.error);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (username && password) {
        const loginAction = await dispatch(login({ username, password }));
        if (loginAction.type === login.fulfilled.type) {
          const payload = loginAction.payload as LoginResponseType;
          const checkTokenAction = await dispatch(
            checkToken({ access_token: payload.access_token })
          );
          if (checkTokenAction.type === checkToken.fulfilled.type)
            navigate(params.get('next') || '/');
        }
      }
    },
    [dispatch, username, password, navigate, params]
  );

  const friendlyErrorMessage = useMemo(() => {
    if (!loginError) return null;
    return <ErrorElement>Log in failed with these details. Try again...</ErrorElement>;
  }, [loginError]);

  return (
    <LoginFormWrapperElement>
      <LoginFormContainerElement>
        <TitleElement>Log In</TitleElement>
        {friendlyErrorMessage}
        <LoginFormElement onSubmit={onSubmit}>
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <ButtonElement disabled={!username || !password}>
            {loginLoading ? 'Loading...' : 'Log In'}
          </ButtonElement>
        </LoginFormElement>
      </LoginFormContainerElement>
    </LoginFormWrapperElement>
  );
};
