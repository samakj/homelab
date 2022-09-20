/** @format */

import React from 'react';
import { navigationConfig } from '../../configs/navigation';
import { useAuthorisation } from '../../routing/authorise';
import { NavItemElement, NavLinkElement, NavLinkText, NavListElement } from './elements';

export const Navigation: React.FunctionComponent = () => {
  const { isInScope } = useAuthorisation();

  return (
    <nav>
      <NavListElement>
        {Object.entries(navigationConfig).map(
          ([key, navItem]) =>
            (!navItem.scopes || isInScope(navItem.scopes)) && (
              <NavItemElement key={key}>
                <NavLinkElement to={navItem.path}>
                  {navItem.icon}
                  <NavLinkText>{navItem.name}</NavLinkText>
                </NavLinkElement>
              </NavItemElement>
            )
        )}
      </NavListElement>
    </nav>
  );
};
