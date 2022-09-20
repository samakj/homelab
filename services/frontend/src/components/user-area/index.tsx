/** @format */

import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from '../../store';
import { LoginLinkElement, UserAreaContainerElement } from './elements';

export const UserArea: React.FunctionComponent = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const user = useSelector((state) => state.authorisation.user);

  const next = useMemo(() => {
    return params.get('next') || location.pathname.replace('/login', '/');
  }, [location, params]);

  return (
    <UserAreaContainerElement>
      {user ? user.name : <LoginLinkElement to={`/login?next=${next}`}>Login</LoginLinkElement>}
    </UserAreaContainerElement>
  );
};
