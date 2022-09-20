/** @format */

import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../store';
import { logout } from '../../store/slices/authorisation/thunks';
import {
  LoginLinkElement,
  LogoutButtonElement,
  UserAreaContainerElement,
  UserMenuElement,
} from './elements';

export const UserArea: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useSelector((state) => state.authorisation.user);
  const access_token = useSelector((state) => state.authorisation.access_token);

  const next = useMemo(() => {
    return params.get('next') || location.pathname.replace('/login', '/');
  }, [location, params]);

  const onLogoutClick = useCallback(() => {
    if (access_token)
      dispatch(logout({ access_token })).then((action) => {
        if (action.type === logout.fulfilled.type) navigate('/');
      });
  }, [access_token, dispatch]);

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
        <LogoutButtonElement onClick={onLogoutClick}>Log Out</LogoutButtonElement>
      </UserMenuElement>
    </UserAreaContainerElement>
  );
};
