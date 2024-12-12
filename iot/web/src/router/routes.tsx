/** @format */
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { NotFound } from '@/pages/404';
import Device from '@/pages/device';
import Devices from '@/pages/devices';
import Home from '@/pages/home';
import Location from '@/pages/location';
import Locations from '@/pages/locations';
import Login from '@/pages/login';
import Measurement from '@/pages/measurement';
import Measurements from '@/pages/measurements';
import Metric from '@/pages/metric';
import Metrics from '@/pages/metrics';

import { Private, Public } from './route';
import { RoutesType } from './types';

export const routes: RoutesType = {
  device: {
    path: '/devices/:id',
    component: Device,
    private: true,
  },
  devices: {
    path: '/devices',
    component: Devices,
    private: true,
  },
  home: {
    path: '/home',
    component: Home,
    private: true,
  },
  location: {
    path: '/locations/:id',
    component: Location,
    private: true,
  },
  locations: {
    path: '/locations',
    component: Locations,
    private: true,
  },
  login: {
    path: '/login',
    component: Login,
  },
  measurement: {
    path: '/measurements/:id',
    component: Measurement,
    private: true,
  },
  measurements: {
    path: '/measurements',
    component: Measurements,
    private: true,
  },
  metric: {
    path: '/metrics/:id',
    component: Metric,
    private: true,
  },
  metrics: {
    path: '/metrics',
    component: Metrics,
    private: true,
  },
};

export const paths = Object.values(routes).map((route) => route.path);

export const Routes: React.FunctionComponent = () => {
  return (
    <RouterRoutes>
      {Object.values(routes).map((route) => (
        <Route
          key={route.path}
          element={
            route.private ? (
              <Private component={route.component} />
            ) : (
              <Public component={route.component} />
            )
          }
          {...route}
        />
      ))}
      {/* Fallback to trade page */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
