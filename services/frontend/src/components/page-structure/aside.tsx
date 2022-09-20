/** @format */

import React from 'react';
import { useAuthorisation } from '../../routing/authorise';
import { AsideContentElement, PageAsideElement } from './elements';

export const Aside: React.FunctionComponent = () => {
  const { checkingToken, user } = useAuthorisation();

  console.log(checkingToken);

  if (checkingToken)
    return (
      <PageAsideElement>
        <AsideContentElement />
      </PageAsideElement>
    );
  if (!user) return <PageAsideElement />;
  return (
    <PageAsideElement>
      <AsideContentElement>apgbojd</AsideContentElement>
    </PageAsideElement>
  );
};
