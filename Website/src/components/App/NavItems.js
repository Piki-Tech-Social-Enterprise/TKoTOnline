import React, {
  useState,
  useEffect
} from 'react';
import {
  NavItem,
  NavLink,
  UncontrolledTooltip
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
    navItemClassName,
    navLinkClassName,
    includeTooltips
  } = props;
  const [state, setState] = useState({
    isLoading: true
  });
  const isActive = (pathname, hash, route) => {
    const parameterIsActive = hash
      ? route.endsWith(hash) || (pathname === '/' && !hash && route === '/#Home')
      : pathname.startsWith(route) && pathname.length > 1 && route.length > 1
    // console.log(`pathname: ${pathname}, hash: ${hash}, route: ${route}, parameterIsActive: ${parameterIsActive}`);
    return parameterIsActive;
  };
  const {
    isLoading
  } = state;
  useEffect(() => {
    if (state.isLoading) {
      setState(s => ({
        ...s,
        isLoading: false
      }));
    }
    return () => { };
  }, [props, state]);
  return (
    <>
      {
        isLoading
          ? null
          : <>
            {
              items.map((item, index) => {
                const ItemAsNavLink = props => {
                  const {
                    item
                  } = props;
                  const {
                    id,
                    route,
                    name,
                    tooltip
                  } = item;
                  return (
                    <>
                      <NavLink
                        id={id}
                        href={route}
                        active={isActive(pathname, hash, route)}
                        className={navLinkClassName || ''}
                      >{name}</NavLink>
                      {
                        includeTooltips
                          ? <UncontrolledTooltip
                            innerClassName="tkot-secondary-color-black-bg-color text-light text-uppercase"
                            placement="top"
                            target={`${id}`}
                          >{tooltip}</UncontrolledTooltip>
                          : null
                      }
                    </>
                  );
                };
                return (
                  <NavItem className={`${navItemClassName || ''}`} key={index}>
                    {
                      useScrollspyNavLinks
                        ? <ScrollspyNavLink name={item.route.replace('/#', '')}>
                          <ItemAsNavLink
                            item={item}
                          />
                        </ScrollspyNavLink>
                        : <ItemAsNavLink
                          item={item}
                        />
                    }
                  </NavItem>
                );
              })
            }
          </>
      }
    </>
  );
};

export default NavItems;
