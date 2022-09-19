/** @format */

import { RequestMetaType } from '../types';
import { UserType } from '../users/types';

export interface SessionType {
  id: number;
  user_id: number;
  created: string;
  expires: string;
  ip: string;
  disabled: boolean;
}

export interface LoginParamsType {
  username: string;
  password: string;
}

export interface LoginResponseType {
  access_token: string;
  user: UserType;
}

export interface TokenUrlParamsType {
  access_token: string;
}

export interface CheckTokenParamsType extends TokenUrlParamsType {}

export interface CheckTokenResponseType {
  scheme: string;
  token: string;
  session: {
    id: number;
    user_id: number;
    created: string;
    expires: string;
    ip: string;
    disabled: boolean;
  };
  user: {
    id: number;
    username: string;
    password: string;
    name: string;
    scopes: string[];
  };
}

export interface AuthorisationSliceType {
  requests: {
    login: RequestMetaType;
    checkToken: RequestMetaType;
  };
  user?: UserType;
  session?: SessionType;
  access_token?: string;
}
