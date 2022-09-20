/** @format */

import React from 'react';
import { Authorise, useAuthorisation } from '../routing/authorise';

const _User: React.FunctionComponent = () => {
  const { user } = useAuthorisation();
  return <pre>{JSON.stringify(user, null, 4)}</pre>;
};

export const User: React.FunctionComponent = () => (
  <Authorise scopes={[]}>
    <_User />
  </Authorise>
);
