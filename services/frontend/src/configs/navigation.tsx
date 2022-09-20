/** @format */

import React from 'react';
import { IconType } from 'react-icons';
import { MdPerson, MdHomeFilled } from 'react-icons/md';

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
  '/metrics': {
    path: '/metrics',
    icon: <MdPerson />,
    name: 'Metrics',
    scopes: ['metrics.get'],
  },
};
