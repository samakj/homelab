/** @format */

import React from 'react';
import { ContainerElement, InputElement, LabelElement } from './elements';
import { InputPropsType } from './types';

export const Input: React.FunctionComponent<InputPropsType> = ({ label, ...rest }) => {
  return (
    <ContainerElement>
      <LabelElement>{label}</LabelElement>
      <InputElement {...rest} />
    </ContainerElement>
  );
};
