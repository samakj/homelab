/** @format */

import React from 'react';
import { Aside } from './aside';
import { PageMainElement, PageStructureElement } from './elements';
import { Header } from './header';

export const PageStructure: React.FunctionComponent = ({ children }) => {
  return (
    <PageStructureElement>
      <Header />
      <Aside />
      <PageMainElement>{children}</PageMainElement>
    </PageStructureElement>
  );
};
