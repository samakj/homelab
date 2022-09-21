/** @format */

import { Url } from '../../../utils/url';
import { createRequestThunk, Request } from '../../../utils/request';
import {
  CheckTokenParamsType,
  CheckTokenResponseType,
  LoginParamsType,
  LoginResponseType,
  LogoutParamsType,
  LogoutResponseType,
  LogoutUrlParamsType,
  TokenUrlParamsType,
} from './types';

export const LoginUrl = new Url('http://authorisation.localhost/v0/login');

export const login = createRequestThunk<LoginResponseType, LoginParamsType>(
  'login',
  async ({ username, password }) =>
    new Request(LoginUrl).post(null, { username, password }).then((response) => response.json())
);

export const LogoutUrl = new Url<null, LogoutUrlParamsType>(
  'http://authorisation.localhost/v0/logout'
);

export const logout = createRequestThunk<LogoutResponseType, LogoutParamsType>(
  'logout',
  async ({ access_token }) =>
    new Request(LogoutUrl).post({ access_token }).then((response) => response.json())
);

export const TokenUrl = new Url<null, TokenUrlParamsType>(
  'http://authorisation.localhost/v0/token'
);

export const checkToken = createRequestThunk<CheckTokenResponseType, CheckTokenParamsType>(
  'checkToken',
  async ({ access_token }) =>
    new Request(TokenUrl).get({ access_token }).then((response) => response.json())
);
