/** @format */

import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from '../store';
import { AuthorisationContextType, AuthorisePropsType } from './types';

export const AuthorisationContext = React.createContext<AuthorisationContextType>(
  {} as AuthorisationContextType
);

export const Authorise: React.FunctionComponent<AuthorisePropsType> = ({ scopes, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkingToken } = useContext(AuthorisationContext);
  const user = useSelector((state) => state.authorisation.user);
  const session = useSelector((state) => state.authorisation.session);

  const isValidSession = useMemo(() => {
    if (!session) return false;
    if (session.disabled) return false;
    if (new Date(session.expires) < new Date()) return false;
    return true;
  }, [session]);

  const isInScope = useMemo(() => {
    if (!user) return false;
    if (
      scopes.find(
        (routeScope) => !user.scopes.find((userScope) => routeScope.startsWith(userScope))
      )
    )
      return false;
    return true;
  }, [user]);

  useEffect(() => {
    if (!checkingToken) {
      if (!isValidSession) {
        console.error('Invalid session');
        navigate(`/login?next=${location.pathname}`, { replace: true });
      } else if (!isInScope) {
        console.error('Out of scope');
        navigate('/', { replace: true });
      }
    }
  }, [checkingToken, isValidSession, isInScope, navigate, location]);

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
