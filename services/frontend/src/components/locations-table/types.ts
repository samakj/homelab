/** @format */

import { LocationsStateType, LocationType } from '../../store/slices/locations/types';
import { ModalPropsType } from '../modal/types';

export interface LocationsTablePropsType {
  locations?: LocationsStateType;
}

export interface DeleteModalPropsType {
  locationId?: LocationType['id'];
  close?: ModalPropsType['close'];
}

export interface EditModalPropsType {
  locationId?: LocationType['id'];
  close?: ModalPropsType['close'];
}

export interface CreateModalPropsType {
  close?: ModalPropsType['close'];
  isOpen?: ModalPropsType['isOpen'];
}
