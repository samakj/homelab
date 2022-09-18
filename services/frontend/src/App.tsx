/** @format */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './style';
import { theme } from './style/theme';

export const App: React.FunctionComponent = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        Hello
      </ThemeProvider>
    </div>
  );
};
