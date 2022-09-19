/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Index } from '../views/index';
import { RouterPropsType } from './types';

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
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </ContextualRouter>
  );
};
