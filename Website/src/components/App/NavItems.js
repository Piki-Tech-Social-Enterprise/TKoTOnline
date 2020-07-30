import React from 'react';
import {
  NavItem,
  NavLink
} from 'reactstrap';
import {
  ScrollspyNavLink
} from 'reactstrap-scrollspy';

const NavItems = props => {
  const {
    useScrollspyNavLinks,
    pathname,
    hash,
    items,
    navLinkClassName
  } = props;
  const isActive = (pathname, hash, route) => {
    const parameterIsActive = hash
      ? route.endsWith(hash) || (pathname === '/' && !hash && route === '/#Home')
      : pathname.startsWith(route) && pathname.length > 1 && route.length > 1
    // console.log(`pathname: ${pathname}, hash: ${hash}, route: ${route}, parameterIsActive: ${parameterIsActive}`);
    return parameterIsActive;
  };
  return (
    <>
      {
        items.map((item, index) => {
          const {
            id,
            route,
            name
          } = item;
          return (
            <NavItem key={index}>
              {
                useScrollspyNavLinks
                  ? <ScrollspyNavLink name={route.replace('/#', '')}>
                    <NavLink
                      id={id}
                      href={route}
                      active={isActive(pathname, hash, route)}
                      className={navLinkClassName || ''}
                    >{name}</NavLink>
                  </ScrollspyNavLink>
                  : <NavLink
                    id={id}
                    href={route}
                    active={isActive(pathname, hash, route)}
                    className={navLinkClassName || ''}
                  >{name}</NavLink>
              }
            </NavItem>
          );
        }
        )
      }
    </>
  );
};

export default NavItems;
