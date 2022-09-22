/** @format */

import React from 'react';
import { ButtonElement } from './elements';
import { ButtonPropsType } from './types';

export const Button: React.FunctionComponent<ButtonPropsType> = ({ children, ...rest }) => {
  return <ButtonElement {...rest}>{children}</ButtonElement>;
};
