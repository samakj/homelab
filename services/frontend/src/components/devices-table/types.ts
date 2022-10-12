/** @format */

import { DevicesStateType, DeviceType } from '../../store/slices/devices/types';
import { LocationsStateType } from '../../store/slices/locations/types';
import { WatchedDeviceMesurementsState } from '../../store/slices/watched-devices/types';
import { ModalPropsType } from '../modal/types';

export interface DevicesTablePropsType {
  devices?: DevicesStateType;
  watchedDeviceMeasurements?: WatchedDeviceMesurementsState;
  locations?: LocationsStateType;
}

export interface DeleteModalPropsType {
  deviceId?: DeviceType['id'];
  close?: ModalPropsType['close'];
}

export interface EditModalPropsType {
  deviceId?: DeviceType['id'];
  close?: ModalPropsType['close'];
}

export interface CreateModalPropsType {
  close?: ModalPropsType['close'];
  isOpen?: ModalPropsType['isOpen'];
}
