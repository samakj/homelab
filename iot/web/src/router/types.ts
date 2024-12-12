/** @format */
import { JSXElementConstructor } from 'react';
import { PathRouteProps } from 'react-router';

import { DevicePagePropsType } from '@/pages/device/types';
import { DevicesPagePropsType } from '@/pages/devices/types';
import { HomePagePropsType } from '@/pages/home/types';
import { LocationPagePropsType } from '@/pages/location/types';
import { LocationsPagePropsType } from '@/pages/locations/types';
import { LoginPagePropsType } from '@/pages/login/types';
import { MeasurementPagePropsType } from '@/pages/measurement/types';
import { MeasurementsPagePropsType } from '@/pages/measurements/types';
import { MetricPagePropsType } from '@/pages/metric/types';
import { MetricsPagePropsType } from '@/pages/metrics/types';

export interface RouterPropsType {}

export interface RouteElementProps<ComponentProps extends {} = {}> {
  component: JSXElementConstructor<ComponentProps>;
}

export interface RouteType<ComponentProps extends {} = {}> extends Omit<PathRouteProps, 'element'> {
  path: string;
  component: JSXElementConstructor<ComponentProps>;
  private?: boolean;
}

export interface RoutesType {
  home: RouteType<HomePagePropsType>;
  login: RouteType<LoginPagePropsType>;
  device: RouteType<DevicePagePropsType>;
  devices: RouteType<DevicesPagePropsType>;
  location: RouteType<LocationPagePropsType>;
  locations: RouteType<LocationsPagePropsType>;
  measurement: RouteType<MeasurementPagePropsType>;
  measurements: RouteType<MeasurementsPagePropsType>;
  metric: RouteType<MetricPagePropsType>;
  metrics: RouteType<MetricsPagePropsType>;
}
