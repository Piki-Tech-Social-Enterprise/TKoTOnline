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
  const sidebar = createRef();
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
      perfectScrollbar = new PerfectScrollbar(sidebar.current, {
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
  }, [props, sidebar]);
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
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          {props.routes.map((prop, key) => {
            if (prop.redirect) return null;
            const { layout, path, pro, icon, name } = prop;
            const routePath = layout + path;
            const activeRouteClassName = `${activeRoute(routePath)}${((pro && ' active-pro') || '')}`;
            return (
              <li className={activeRouteClassName} key={key}>
                <NavLink to={routePath} className="nav-link" activeClassName="active">
                  <i className={'now-ui-icons ' + icon} />
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
