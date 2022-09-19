/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { RouterPropsType } from './types';
import { AuthorisationProvider } from '../authorisation';

import { Index } from '../views/index';
import { Login } from '../views/login';

export const ContextualRouter: React.FunctionComponent<RouterPropsType> = ({
  location,
  children,
}) =>
  location ? (
    <StaticRouter location={location}>{children}</StaticRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

export const Router: React.FunctionComponent<RouterPropsType> = (props) => {
  return (
    <ContextualRouter {...props}>
      <AuthorisationProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthorisationProvider>
    </ContextualRouter>
  );
};
