/** @format */

import React from 'react';
import { Authorise } from '../routing/authorise';
import { useSelector } from '../store';

const _User: React.FunctionComponent = () => {
  const user = useSelector((state) => state.authorisation.user);
  return <pre>{JSON.stringify(user, null, 4)}</pre>;
};

export const User: React.FunctionComponent = () => (
  <Authorise scopes={[]}>
    <_User />
  </Authorise>
);
