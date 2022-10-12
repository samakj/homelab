/** @format */

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  background-color: ${({ theme }) => theme.colours.background};
  color: ${({ theme }) => theme.colours.foreground};
  font-family: 'Roboto', sans-serif;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  button {
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;

    &:disabled {
      cursor: auto;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    padding-bottom: 0.125rem;
    border-bottom: 1px dashed ${({ theme }) => theme.colours.white}
  }
}
`;
