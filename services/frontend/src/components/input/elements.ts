/** @format */

import { transparentize } from 'polished';
import styled from 'styled-components';

export const ContainerElement = styled.label`
  display: block;
`;

export const LabelElement = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  user-select: none;
`;

export const InputElement = styled.input`
  appearance: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.75, theme.colours.foreground)};
  color: ${({ theme }) => theme.colours.foreground};
  padding: 0.25rem;
  font-size: 1rem;
  width: fill-available;
  outline: none;
  background: transparent;
  transition: border-color 300ms;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colours.foreground};
  }
`;
