import React, {
  createRef,
  useEffect
} from 'react';
import {
  NavLink
} from 'react-router-dom';
import {
  Nav
} from 'reactstrap';
import PerfectScrollbar from 'perfect-scrollbar';
import logo from 'assets/img/tkot/tkot-logo-512x512.png';

const AuthSidebar = props => {
  const sidebarRef = createRef();
  const activeRoute = routeName => {
    return props.location.pathname.indexOf(routeName) > -1
      ? 'active'
      : '';
  };
  useEffect(() => {
    const {
      platform
    } = navigator;
    const platformWin = 'Win';
    let perfectScrollbar;
    const {
      classList: bodyCssClasses
    } = document.body;
    const perfectScrollbarOn = 'perfect-scrollbar-on';
    if (platform.indexOf(platformWin) > -1) {
      perfectScrollbar = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      bodyCssClasses.toggle(perfectScrollbarOn);
    }
    return () => {
      if (platform.indexOf(platformWin) > -1) {
        perfectScrollbar.destroy();
      }
    };
  }, [props, sidebarRef]);
  return (
    <div className="sidebar" data-color={props.backgroundColor}>
      <div className="logo text-white">
          <div className="logo-img" style={{
            display: 'inline-block',
            width: '1.5rem'
          }}>
            <img src={logo} alt="react-logo" />
          </div>
          <span className="p-3 h6">Te Kahu o Taonui</span>
      </div>
      <div className="sidebar-wrapper" ref={sidebarRef}>
        <Nav>
          {props.routes.map((route, key) => {
            if (route.redirect || route.excludeFromSidebar) return null;
            const { layout, path, iconLibrary, icon, name } = route;
            const routePath = layout + path;
            const activeRouteClassName = `${activeRoute(routePath)}`;
            const iconClassNames = `${iconLibrary || 'now-ui-icons'} ${icon}`;
            return (
              <li className={activeRouteClassName} key={key}>
                <NavLink to={routePath} className="nav-link" activeClassName="active">
                  <i className={iconClassNames} />
                  <p>{name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
};

export default AuthSidebar;
