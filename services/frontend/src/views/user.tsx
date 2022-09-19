/** @format */

import React from 'react';
import { Authorise } from '../routing/authorise';
import { AuthorisePropsType } from '../routing/types';
import { useSelector } from '../store';

const _User: React.FunctionComponent = () => {
  const user = useSelector((state) => state.authorisation.user);
  return <pre>{JSON.stringify(user, null, 4)}</pre>;
};

export const User: React.FunctionComponent<Pick<AuthorisePropsType, 'isLoading'>> = ({
  isLoading,
}) => (
  <Authorise isLoading={isLoading} scopes={[]}>
    <_User />
  </Authorise>
);
