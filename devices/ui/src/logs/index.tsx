/** @format */

import React, { useState } from 'react';
import { PageSection, PageSectionTitle } from '../shared-elements';

export const Logs: React.FunctionComponent = () => {
  const [closed, setClosed] = useState(false);
  return (
    <PageSection closed={closed}>
      <PageSectionTitle onClick={() => setClosed(!closed)}>Logs</PageSectionTitle>
    </PageSection>
  );
};
