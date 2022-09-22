/** @format */

import { transparentize } from 'polished';
import styled from 'styled-components';

export const ModalRootElement = styled.div`
  height: 0;
  width: 0;
`;

export const ModalBackgroundElement = styled.div`
  background-color: ${({ theme }) => transparentize(0.2, theme.colours.background)};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

export const ModalContainerElement = styled.div`
  background-color: ${({ theme }) => theme.colours.background};
  box-shadow: 0 0 1rem 0 ${({ theme }) => transparentize(0.7, theme.colours.foreground)};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ModalContentElement = styled.div`
  padding: 1rem;
`;

export const ModalTitleElement = styled.h2`
  margin: 0 0 2rem;
  font-size: 1.25rem;
`;

export const ModalBodyElement = styled.div`
  margin-bottom: 1rem;
`;

export const ModalActionsElement = styled.div`
  * {
    margin-right: 0.25rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;
