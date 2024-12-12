/** @format */
import React from 'react';

// import { useCookies } from 'react-cookie';
// import { Navigate } from 'react-router';
// import { useSelector } from '@/store';
// import { useSetIsAuthenticated } from '@/store/slices/sessions/hooks';
import { RouteElementProps } from './types';

export const Private: React.FunctionComponent<RouteElementProps> = ({ component: Component }) => {
  // Allow authelia to handle authentication
  // const [cookie] = useCookies();
  // const setIsAuthenticated = useSetIsAuthenticated();
  // let isAuthenticated = useSelector((state) => state.sessions.isAuthenticated);

  // if (!isAuthenticated && cookie['is-authenticated']) {
  //   isAuthenticated = true;
  //   setIsAuthenticated(true);
  // }

  // // isAuthenticated = null means its still loading
  // if (isAuthenticated === false)
  //   return <Navigate to={`/login?next=${location.href.replace(location.origin, '')}`} />;

  return <Component />;
};

export const Public: React.FunctionComponent<RouteElementProps> = ({ component: Component }) => (
  <Component />
);
