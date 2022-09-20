/** @format */

import React from 'react';
import { BrowserRouter, Routes as RoutesWrapper, Route, Navigate } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { RouterPropsType } from './types';

import { Index } from '../views/index';
import { Login } from '../views/login';
import { User } from '../views/user';
import { PageStructure } from '../components/page-structure';
import { AuthorisationProvider } from './authorise';

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
  return (
    <AuthorisationProvider>
      <PageStructure>
        <RoutesWrapper>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </RoutesWrapper>
      </PageStructure>
    </AuthorisationProvider>
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
