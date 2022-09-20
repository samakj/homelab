/** @format */

import React from 'react';
import { useSelector } from '../../store';
import { AsideContentElement, PageAsideElement } from './elements';

export const Aside: React.FunctionComponent = () => {
  const user = useSelector((state) => state.authorisation.user);

  if (!user) return <PageAsideElement />;
  return (
    <PageAsideElement>
      <AsideContentElement>apgbojd</AsideContentElement>
    </PageAsideElement>
  );
};
