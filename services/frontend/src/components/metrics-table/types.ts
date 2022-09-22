/** @format */

import { MetricsStateType, MetricType } from '../../store/slices/metrics/types';
import { ModalPropsType } from '../modal/types';

export interface MetricsTablePropsType {
  metrics?: MetricsStateType;
}

export interface DeleteModalPropsType {
  metricId?: MetricType['id'];
  close?: ModalPropsType['close'];
}

export interface EditModalPropsType {
  metricId?: MetricType['id'];
  close?: ModalPropsType['close'];
}

export interface CreateModalPropsType {
  close?: ModalPropsType['close'];
  isOpen?: ModalPropsType['isOpen'];
}
