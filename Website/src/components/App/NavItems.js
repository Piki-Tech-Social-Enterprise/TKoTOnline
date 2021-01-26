import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  UncontrolledTooltip
} from 'reactstrap';
import {
  ScrollspyNavLink
} from 'reactstrap-scrollspy';
import {
  isNullOrEmpty
} from 'components/App/Utilities';

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
  const subMenus = {};
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
                const ItemAsDropdownItem = props => {
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
                      <DropdownItem
                        id={id}
                        href={route}
                        active={isActive(pathname, hash, route)}
                        className={`text-uppercase ${navLinkClassName || ''}`}
                      >{name}</DropdownItem>
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
