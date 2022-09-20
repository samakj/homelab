/** @format */

import styled from 'styled-components';
import { transparentize } from 'polished';

export const LoginFormWrapperElement = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginFormContainerElement = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 1rem;
  padding: 1rem;
  box-shadow: 0 0 1rem 0 ${({ theme }) => theme.colours.border.light};
`;

export const LoginFormElement = styled.form`
  display: grid;
  grid-gap: 0.5rem;
`;

export const TitleElement = styled.h1`
  margin: 0;
`;

export const ErrorElement = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colours.red};
`;

export const ButtonElement = styled.button`
  appearance: none;
  border: none;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colours.foreground};
  margin-top: 0.5rem;
  transition: background-color 300ms;

  &:disabled {
    background-color: ${({ theme }) => transparentize(0.5, theme.colours.white)};
  }
`;
