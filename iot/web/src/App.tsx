/** @format */
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { Router } from '@/router';
import { store } from '@/store';

const App: React.FunctionComponent = () => {
  return (
    <StoreProvider store={store}>
      <Router />
    </StoreProvider>
  );
};

export default App;
