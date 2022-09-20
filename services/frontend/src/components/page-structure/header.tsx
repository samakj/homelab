/** @format */

import React from 'react';
import { UserArea } from '../user-area';
import { HeaderElement, PageHeaderElement } from './elements';

export const Header: React.FunctionComponent = () => {
  return (
    <PageHeaderElement>
      <HeaderElement>Homelab</HeaderElement>
      <UserArea />
    </PageHeaderElement>
  );
};
