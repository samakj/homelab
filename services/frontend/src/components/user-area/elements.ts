/** @format */

import { transparentize } from 'polished';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const UserMenuElement = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0%;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.border.light};
  border-top: none;
`;

export const UserAreaContainerElement = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => theme.dimensions.sidebar.width};

  &:hover ${UserMenuElement} {
    display: block;
  }
`;

export const LoginLinkElement = styled(Link)`
  background-color: ${({ theme }) => theme.colours.foreground};
  color: ${({ theme }) => theme.colours.background};
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`;

export const LogoutButtonElement = styled.button`
  background-color: ${({ theme }) => theme.colours.foreground};
  color: ${({ theme }) => theme.colours.background};
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  appearance: none;
  margin: 1rem;
`;
