/** @format */

import { transparentize } from 'polished';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const NavListElement = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItemElement = styled.li`
  transition: background-color 300ms;
  border-bottom: 1px solid ${({ theme }) => theme.colours.border.light};

  &:hover {
    background-color: ${({ theme }) => transparentize(0.7, theme.colours.white)};
  }
`;

export const NavLinkElement = styled(Link)`
  padding: 1rem 2rem;
  text-decoration: none;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  align-items: center;
  color: inherit;
  border-bottom: none;
`;

export const NavLinkText = styled.span``;
