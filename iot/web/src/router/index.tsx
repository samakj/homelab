/** @format */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Header } from '@/components/header';
import { PageStructure } from '@/components/page-structure';

import { Routes } from './routes';
import { RouterPropsType } from './types';

export const Router: React.FunctionComponent<RouterPropsType> = () => {
  return (
    <BrowserRouter>
      <PageStructure>
        <Header />
        <Routes />
      </PageStructure>
    </BrowserRouter>
  );
};
