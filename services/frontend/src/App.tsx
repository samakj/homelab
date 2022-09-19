/** @format */

import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router } from './routing';
import { RouterPropsType } from './routing/types';
import { store } from './store';
import { GlobalStyle } from './style';
import { theme } from './style/theme';

export const App: React.FunctionComponent<RouterPropsType> = (props) => {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router location={props.location} />
      </ThemeProvider>
    </StoreProvider>
  );
};
