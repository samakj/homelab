/** @format */

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  background-color: ${({ theme }) => theme.colours.black};
  color: ${({ theme }) => theme.colours.white};
  font-family: 'Roboto', sans-serif;

  * {
    box-sizing: border-box;
  }
}
`;
