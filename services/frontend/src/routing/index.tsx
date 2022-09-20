/** @format */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes as RoutesWrapper, Route, Navigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { RouterPropsType } from './types';
import { useCookies } from 'react-cookie';
import { authorisationConfig } from '../configs/authorisation';
import { checkToken } from '../store/slices/authorisation/thunks';

import { Index } from '../views/index';
import { Login } from '../views/login';
import { User } from '../views/user';
import { useDispatch } from '../store';
import { PageStructure } from '../components/page-structure';
import { AuthorisationContext } from './authorise';

export const ContextualRouter: React.FunctionComponent<RouterPropsType> = ({
  location,
  children,
}) =>
  location ? (
    <StaticRouter location={location}>{children}</StaticRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

export const Routes: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies([authorisationConfig.cookie]);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    dispatch(checkToken({ access_token: cookies[authorisationConfig.cookie] })).then(() =>
      setCheckingToken(false)
    );
  }, [dispatch, cookies]);

  return (
    <AuthorisationContext.Provider value={{ checkingToken, setCheckingToken }}>
      <PageStructure>
        <RoutesWrapper>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </RoutesWrapper>
      </PageStructure>
    </AuthorisationContext.Provider>
  );
};

export const Router: React.FunctionComponent<RouterPropsType> = ({ location }) => {
  return location ? (
    <StaticRouter location={location}>
      <Routes />
    </StaticRouter>
  ) : (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};
