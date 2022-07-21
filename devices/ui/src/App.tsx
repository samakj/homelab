/** @format */

import React, { useEffect } from 'react';
import { Logs } from './logs';
import { PageGrid, GlobalStyle, Header } from './shared-elements';
import { StateTable } from './state-table';

export const App: React.FunctionComponent = () => {
  useEffect(() => {
    if (process.env.HOSTNAME) document.title = `${process.env.HOSTNAME}`;
  }, []);

  return (
    <PageGrid>
      <GlobalStyle />
      <Header>
        {process.env.HOSTNAME} - {process.env.IP_ADDRESS}
      </Header>
      <StateTable />
      <Logs />
    </PageGrid>
  );
};
