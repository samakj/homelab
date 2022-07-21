/** @format */

import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  background-color: black;
  color: white;
  font-family: 'Roboto', sans-serif;

  * {
    box-sizing: border-box;
  }
}
`;

export const PageGrid = styled.div`
<<<<<<< HEAD
  height: 100vh;
  width: 100vw;
=======
  height: 100%;
  width: 100%;
>>>>>>> f347110 (fix: Start device ui with simple state view)
  display: grid;
  grid-template-areas: 'header' 'state' 'logs';
  grid-template-rows: auto auto 1fr;
`;

export const Header = styled.h1`
  grid-area: header;
  margin: 0;
  text-align: center;
  padding: 1rem;
`;

export const PageSection = styled.section<{ closed?: boolean }>`
  height: ${({ closed }) => (closed ? '1.5rem' : 'auto')};
  border-top: 1px solid white;
  overflow: hidden;
`;

export const PageSectionTitle = styled.h2`
  height: 1.5rem;
  width: 100%;
  padding: 0 1.5rem;
  margin: 0;
  font-weight: normal;
  font-size: 0.75rem;
  text-transform: uppercase;
  line-height: 1.5rem;
`;
