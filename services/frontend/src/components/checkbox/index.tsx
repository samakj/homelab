/** @format */

import React from 'react';
import { ContainerElement, InputElement, LabelElement } from './elements';
import { InputPropsType } from './types';

export const Checkbox: React.FunctionComponent<InputPropsType> = ({ label, ...rest }) => {
  return (
    <ContainerElement>
      <InputElement type="checkbox" {...rest} />
      <LabelElement>{label}</LabelElement>
    </ContainerElement>
  );
};
