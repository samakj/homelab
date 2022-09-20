/** @format */

import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const UserAreaContainerElement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => theme.dimensions.sidebar.width};
`;

export const LoginLinkElement = styled(Link)`
  background-color: ${({ theme }) => theme.colours.white};
  color: ${({ theme }) => theme.colours.black};
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`;
