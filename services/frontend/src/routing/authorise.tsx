/** @format */

import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from '../store';
import { AuthorisePropsType } from './types';

export const Authorise: React.FunctionComponent<AuthorisePropsType> = ({
  isLoading,
  scopes,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    if (!isLoading) {
      if (!isValidSession) {
        console.error('Invalid session');
        navigate(`/login?next=${location.pathname}`, { replace: true });
      } else if (!isInScope) {
        console.error('Out of scope');
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, isValidSession, isInScope, navigate, location]);

  return (
    <>
      {isLoading ? (
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
