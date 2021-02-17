import React, {
  useRef,
  useState,
  useEffect,
  Fragment
} from 'react';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const DropdownItem = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/DropdownItem'));
const DropdownMenu = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/DropdownMenu'));
const DropdownToggle = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/DropdownToggle'));
const NavItem = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/NavItem'));
const NavLink = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/NavLink'));
const UncontrolledDropdown = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/UncontrolledDropdown'));
const UncontrolledTooltip = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/UncontrolledTooltip'));
const ScrollspyNavLink = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap-scrollspy/lib/scrollspyNavLink'));
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
    isLoading: true,
    isNullOrEmpty: null
  });
  const isActive = (pathname, hash, route) => {
    const parameterIsActive = hash
      ? route.endsWith(hash) || (pathname === '/' && !hash && route === '/#Home')
      : pathname.startsWith(route) && pathname.length > 1 && route.length > 1
    return parameterIsActive;
  };
  const {
    isLoading,
    isNullOrEmpty
  } = state;
  const subMenus = {};
  useEffect(() => {
    const retrieveData = async () => {
      const {
        isNullOrEmpty
      } = await import(/* webpackPrefetch: true */'components/App/Utilities');
      setState(s => ({
        ...s,
        isLoading: false,
        isNullOrEmpty
      }));
    };
    if (state.isLoading) {
      retrieveData();
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
                    route,
                    name,
                    tooltip
                  } = item;
                  const [ready, setReady] = useState(false);
                  const navLinkRef = useRef();
                  const {
                    current: navLinkRefCurrent
                  } = navLinkRef;
                  useEffect(() => {
                    if (!ready && navLinkRefCurrent) {
                      setReady(true);
                    }
                  }, [ready, navLinkRefCurrent]);
                  return (
                    <>
                      <NavLink
                        href={route}
                        active={isActive(pathname, hash, route)}
                        className={navLinkClassName || ''}
                      >{name}</NavLink>
                      {
                        includeTooltips && ready
                          ? <UncontrolledTooltip
                            innerClassName="tkot-secondary-color-black-bg-color text-light text-uppercase"
                            placement="top"
                            target={navLinkRefCurrent}
                          >{tooltip}</UncontrolledTooltip>
                          : null
                      }
                    </>
                  );
                };
                const ItemAsDropdownItem = props => {
                  const {
                    item
                  } = props;
                  const {
                    route,
                    name,
                    tooltip
                  } = item;
                  const [ready, setReady] = useState(false);
                  const dropdownItemRef = useRef();
                  const {
                    current: dropdownItemRefCurrent
                  } = dropdownItemRef;
                  useEffect(() => {
                    if (!ready && dropdownItemRefCurrent) {
                      setReady(true);
                    }
                  }, [ready, dropdownItemRefCurrent]);
                  return (
                    <>
                      <DropdownItem
                        href={route}
                        active={isActive(pathname, hash, route)}
                        className={`text-uppercase ${navLinkClassName || ''}`}
                        ref={dropdownItemRef}
                      >{name}</DropdownItem>
                      {
                        includeTooltips && ready
                          ? <UncontrolledTooltip
                            innerClassName="tkot-secondary-color-black-bg-color text-light text-uppercase"
                            placement="top"
                            target={dropdownItemRefCurrent}
                          >{tooltip}</UncontrolledTooltip>
                          : null
                      }
                    </>
                  );
                };
                const {
                  menu,
                  group
                } = item;
                return (
                  <Fragment key={index}>
                    {
                      menu
                        ? !Boolean(subMenus[menu])
                          ? <>
                            {(subMenus[menu] = true)}
                            <UncontrolledDropdown nav inNavbar className={!isNullOrEmpty(navItemClassName) ? `ml-lg-auto${group === 'right' ? ' mr-lg-5' : ''}` : ''}>
                              <DropdownToggle nav caret>
                                {menu}
                              </DropdownToggle>
                              <DropdownMenu>
                                {
                                  items.filter(i => i.menu === menu).map((i, itemIndex) => {
                                    return (
                                      <Fragment key={itemIndex}>
                                        <ItemAsDropdownItem
                                          item={i}
                                        />
                                      </Fragment>
                                    );
                                  })
                                }
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </>
                          : null
                        : <>
                          <NavItem className={`${navItemClassName || ''}`}>
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
                        </>
                    }
                  </Fragment>
                );
              })
            }
          </>
      }
    </>
  );
};

export default NavItems;
