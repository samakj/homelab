/** @format */

import React from 'react';
import { MdPerson, MdHomeFilled, MdGpsFixed } from 'react-icons/md';
import { FaTape, FaRuler, FaMicrochip } from 'react-icons/fa';
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
  '/devices': {
    path: '/devices',
    icon: <FaMicrochip />,
    name: 'Devices',
    scopes: [scopesMap.devices.get],
  },
  '/locations': {
    path: '/locations',
    icon: <MdGpsFixed />,
    name: 'Locations',
    scopes: [scopesMap.locations.get],
  },
  '/measurements': {
    path: '/measurements',
    icon: <FaTape />,
    name: 'Measurements',
    scopes: [scopesMap.measurements.get],
  },
  '/metrics': {
    path: '/metrics',
    icon: <FaRuler />,
    name: 'Metrics',
    scopes: [scopesMap.metrics.get],
  },
};
