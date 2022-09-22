/** @format */

import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useAuthorisation } from '../../routing/authorise';
import { useDispatch } from '../../store';
import { logout } from '../../store/slices/authorisation/thunks';
import { Button } from '../button';
import { LoginLinkElement, UserAreaContainerElement, UserMenuElement } from './elements';

export const UserArea: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkingToken, user, access_token } = useAuthorisation();
  const [params] = useSearchParams();

  const next = useMemo(() => {
    return params.get('next') || location.pathname.replace('/login', '/');
  }, [location, params]);

  const onLogoutClick = useCallback(() => {
    if (access_token)
      dispatch(logout({ access_token })).then((action) => {
        if (action.type === logout.fulfilled.type) navigate('/');
      });
  }, [access_token, dispatch]);

  if (checkingToken) return <UserAreaContainerElement />;
  if (!user)
    return (
      <UserAreaContainerElement>
        <LoginLinkElement to={`/login?next=${next}`}>Login</LoginLinkElement>
      </UserAreaContainerElement>
    );
  return (
    <UserAreaContainerElement>
      {user.name}
      <UserMenuElement>
        <Button onClick={onLogoutClick}>Log Out</Button>
      </UserMenuElement>
    </UserAreaContainerElement>
  );
};
