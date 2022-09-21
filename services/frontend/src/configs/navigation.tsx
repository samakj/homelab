/** @format */

import React from 'react';
import { MdPerson, MdHomeFilled, MdGpsFixed } from 'react-icons/md';
import { scopesMap } from './scopes';

export const navigationConfig: {
  [key: string]: {
    path: string;
    icon?: React.ReactNode;
    name: string;
    scopes?: string[];
  };
} = {
  '/': {
    path: '/',
    icon: <MdHomeFilled />,
    name: 'Home',
  },
  '/user': {
    path: '/user',
    icon: <MdPerson />,
    name: 'User',
    scopes: [],
  },
  '/locations': {
    path: '/locations',
    icon: <MdGpsFixed />,
    name: 'Locations',
    scopes: [scopesMap.locations.get],
  },
};
