/** @format */

import React, { useEffect } from 'react';
import { useDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../store/slices/authorisation/thunks';
import { useCookies } from 'react-cookie';
import { authorisationConfig } from '../configs/authorisation';
import { isClient } from '../utils';

export const AuthorisationProvider: React.FunctionComponent = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies([authorisationConfig.cookie]);

  useEffect(() => {
    dispatch(checkToken({ access_token: cookies[authorisationConfig.cookie] })).then((action) => {
      if (action.type.includes('rejected') && isClient())
        if (location.pathname !== '/login') navigate('/login');
    });
  }, [dispatch, cookies, navigate]);

  return <>{children}</>;
};
