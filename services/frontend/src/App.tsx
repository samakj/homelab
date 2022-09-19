/** @format */

import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router } from './routing';
import { store } from './store';
import { GlobalStyle } from './style';
import { theme } from './style/theme';

export const App: React.FunctionComponent = () => {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </StoreProvider>
  );
};
