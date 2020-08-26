import React, {
  useState,
  useEffect,
  lazy
} from 'react';
import {
  NavItem,
  NavLink
} from 'reactstrap';
import {
  ScrollspyNavLink
} from 'reactstrap-scrollspy';

const Tooltips = lazy(async () => await import('components/App/Tooltips'));
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
                    name
                  } = item;
                  return (
                    <NavLink
                      id={id}
                      href={route}
                      active={isActive(pathname, hash, route)}
                      className={navLinkClassName || ''}
                    >{name}</NavLink>
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
            {
              includeTooltips
                ? <Tooltips
                  items={items}
                />
                : null
            }
          </>
      }
    </>
  );
};

export default NavItems;
