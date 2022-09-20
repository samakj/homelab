/** @format */

import { SessionType } from '../store/slices/authorisation/types';
import { UserType } from '../store/slices/users/types';

export interface RouterPropsType {
  location?: string;
}

export interface AuthorisePropsType {
  scopes: string[];
}

export interface AuthorisationContextType {
  checkingToken: boolean;
  setCheckingToken: (checkingToken: boolean) => void;
  user?: UserType;
  session?: SessionType;
  access_token?: string;
  isValidSession: boolean;
  isInScope: (scopes: string[]) => boolean;
}
