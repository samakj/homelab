/** @format */

import styled from 'styled-components';

export const ButtonElement = styled.button<{ negative?: boolean }>`
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.colours.foreground};
  background: ${({ theme, negative }) =>
    negative ? theme.colours.background : theme.colours.foreground};
  color: ${({ theme, negative }) =>
    negative ? theme.colours.foreground : theme.colours.background};
  font-size: 0.675rem;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  font-weight: bold;
`;
