/** @format */

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router';
import { authorisationConfig } from '../configs/authorisation';
import { useDispatch, useSelector } from '../store';
import { checkToken } from '../store/slices/authorisation/thunks';
import { AuthorisationContextType, AuthorisePropsType } from './types';

export const AuthorisationContext = React.createContext<AuthorisationContextType>(
  {} as AuthorisationContextType
);

export const AuthorisationProvider: React.FunctionComponent = ({ children }) => {
  const dispatch = useDispatch();
  const [cookies] = useCookies([authorisationConfig.cookie]);
  const cookie_access_token = useMemo(() => cookies[authorisationConfig.cookie], [cookies]);
  const [access_token, setAccessToken] = useState<string | undefined>(undefined);
  const [checkingToken, setCheckingToken] = useState(!!cookie_access_token);

  const user = useSelector((state) => state.authorisation.user);
  const session = useSelector((state) => state.authorisation.session);

  const isValidSession = useMemo(() => {
    if (!session) return false;
    if (session.disabled) return false;
    if (new Date(session.expires) < new Date()) return false;
    return true;
  }, [session]);

  const isInScope = useCallback(
    (scopes: string | string[]) => {
      if (!user) return false;
      if (!Array.isArray(scopes)) scopes = [scopes];
      if (
        scopes.find(
          (routeScope) => !user.scopes.find((userScope) => routeScope.startsWith(userScope))
        )
      )
        return false;
      return true;
    },
    [user]
  );

  useEffect(() => {
    if (cookie_access_token) {
      setCheckingToken(true);
      dispatch(checkToken({ access_token: cookie_access_token })).then((action) => {
        if (action.type === checkToken.fulfilled.type) setAccessToken(cookie_access_token);
        setCheckingToken(false);
      });
    }
  }, [dispatch, cookie_access_token, setCheckingToken, setAccessToken]);

  return (
    <AuthorisationContext.Provider
      value={{
        access_token,
        setAccessToken,
        checkingToken,
        setCheckingToken,
        user,
        session,
        isInScope,
        isValidSession,
      }}
    >
      {children}
    </AuthorisationContext.Provider>
  );
};

export const useAuthorisation = () => {
  const context = useContext(AuthorisationContext);
  return context;
};

export const Authorise: React.FunctionComponent<AuthorisePropsType> = ({ scopes, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkingToken, isValidSession, isInScope } = useContext(AuthorisationContext);

  useEffect(() => {
    if (!checkingToken) {
      if (!isValidSession) {
        console.error('Invalid session');
        navigate(`/login?next=${location.pathname}`, { replace: true });
      } else if (!isInScope(scopes)) {
        console.error('Out of scope');
        navigate('/', { replace: true });
      }
    }
  }, [checkingToken, isValidSession, isInScope, scopes, navigate, location]);

  return (
    <>
      {checkingToken ? (
        <div>Loading...</div>
      ) : !isValidSession ? (
        'Invalid session!'
      ) : !isInScope ? (
        'Out of scope!'
      ) : (
        children
      )}
    </>
  );
};
