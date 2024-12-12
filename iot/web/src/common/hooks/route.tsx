/** @format */
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { routes } from '@/router/routes';
import { RouteType } from '@/router/types';

export const useRoute = () => {
  const location = useLocation();
  const [route, setRoute] = useState<RouteType>(
    Object.values(routes).find((route) => matchPath(route.path, location.pathname))
  );

  useEffect(() => {
    const newRoute = Object.values(routes).find((route) =>
      matchPath(route.path, location.pathname)
    );

    if (newRoute.path !== route?.path) {
      setRoute(newRoute);
    }
  }, [location.pathname, route]);

  return route;
};
