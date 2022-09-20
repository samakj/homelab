/** @format */

import React from 'react';
import { useAuthorisation } from '../../routing/authorise';
import { Navigation } from '../navigation';
import { AsideContentElement, PageAsideElement } from './elements';

export const Aside: React.FunctionComponent = () => {
  const { checkingToken, user } = useAuthorisation();

  if (checkingToken)
    return (
      <PageAsideElement>
        <AsideContentElement />
      </PageAsideElement>
    );
  if (!user) return <PageAsideElement />;
  return (
    <PageAsideElement>
      <AsideContentElement>
        <Navigation />
      </AsideContentElement>
    </PageAsideElement>
  );
};
