/** @format */

import React, { useContext } from 'react';
import { AuthorisationContext } from '../../routing/authorise';
import { useSelector } from '../../store';
import { AsideContentElement, PageAsideElement } from './elements';

export const Aside: React.FunctionComponent = () => {
  const { checkingToken } = useContext(AuthorisationContext);
  const user = useSelector((state) => state.authorisation.user);

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
