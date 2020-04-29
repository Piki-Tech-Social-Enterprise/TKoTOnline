import React, {
  useState,
  createRef,
  useEffect,
  Suspense
} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
// import PerfectScrollbar from 'perfect-scrollbar';f
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import AuthSidebar from 'components/Sidebar/AuthSidebar';
import AuthNavbar from 'components/Navbars/AuthNavbar';
import AuthFooter from 'components/Footer/AuthFooter';
import authRoutes, {
  getAuthRouteByName
} from 'authRoutes';
import withAuthentication from 'components/Firebase/HighOrder/withAuthentication';
import withEmailVerification from 'components/Firebase/HighOrder/withEmailVerification';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import {
  compose
} from 'recompose';
import {
  basicRole,
  adminRole,
  systemAdminRole
} from 'components/Domains/Roles';

const hasRole = (roles, role) => {
  return roles && !!roles[role];
};
const hasRoles = (roles, rolesToCheck) => {
  let hasRolesConfirmed = false;
  Object.keys(roles).map(roleKey => {
    if (!hasRolesConfirmed) {
      hasRolesConfirmed = hasRole(rolesToCheck, roleKey);
    }
    return null;
  });
  return hasRolesConfirmed;
};
const applyRedirect = props => {
  const fromRoute = getAuthRouteByName('Home');
  const dashboardRoute = getAuthRouteByName('Dashboard');
  const resourceDriveRoute = getAuthRouteByName('Resource Drive');
  const {
    authUser
  } = props;
  const authUserRoles = authUser && authUser.roles
    ? authUser.roles
    : [];
  const toRoute = hasRoles(authUserRoles, { systemAdminRole, adminRole })
    ? dashboardRoute
    : hasRoles(authUserRoles, { basicRole })
      ? resourceDriveRoute
      : null;
  console.log(`fromRoute: ${fromRoute && (fromRoute.layout + fromRoute.path)}, toRoute: ${toRoute && (toRoute.layout + toRoute.path)}`);
  return (
    toRoute
      ? <Redirect from={fromRoute.layout + fromRoute.path} to={toRoute.layout + toRoute.path} />
      : null
  );
};
const getAuthenticatedRoutes = (authUserRoles, logRoutes = false) => {
  const authenticatedRoutes = [];
  Object.keys(authRoutes).map(routeKey => {
    const route = authRoutes[routeKey];
    if (route && route.path && !route.excludeFromAuthenticatedRoutes && hasRoles(route.roles, authUserRoles)) {
      if (logRoutes) {
        console.log(`authenticatedRoute: ${JSON.stringify(route, null, 2)}`);
      }
      authenticatedRoutes.push(route);
    }
    return null;
  });
  return authenticatedRoutes;
};
const AuthLayout = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatedRoutes, setAuthenticatedRoutes] = useState([]);
  const mainPanel = createRef();
  useEffect(() => {
    const {
      platform
    } = navigator;
    const platformWin = 'Win';
    // let perfectScrollbar;
    const {
      classList: bodyCssClasses
    } = document.body;
    const perfectScrollbarOn = 'perfect-scrollbar-on';
    const pushAction = 'PUSH';
    const {
      history,
      authUser
    } = props;
    if (isLoading) {
      if (platform.indexOf(platformWin) > -1) {
        // perfectScrollbar = new PerfectScrollbar(mainPanel.current);
        bodyCssClasses.toggle(perfectScrollbarOn);
      }
      if (history.action === pushAction) {
        if (mainPanel && mainPanel.current) {
          mainPanel.current.scrollTop = 0;
        }
        if (document && document.scrollingElement && document.scrollingElement.scrollTop) {
          document.scrollingElement.scrollTop = 0;
        }
      }
      if (authUser && authUser.roles) {
        const authenticatedRoutes = getAuthenticatedRoutes(authUser.roles);
        setAuthenticatedRoutes(authenticatedRoutes);
      }
    }
    return () => {
      if (platform.indexOf(platformWin) > -1) {
        // perfectScrollbar.destroy();
        bodyCssClasses.toggle(perfectScrollbarOn);
      }
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, mainPanel, isLoading]);
  return (
    <>
      {
        isLoading
          ? <LoadingOverlayModal />
          : <div className="wrapper">
            <AuthSidebar {...props} routes={authenticatedRoutes} backgroundColor={'blue'} />
            <div className="main-panel" ref={mainPanel}>
              <AuthNavbar {...props} routes={authenticatedRoutes} />
              <Switch>
                <Suspense fallback={<LoadingOverlayModal />}>
                  {applyRedirect(props)}
                  {authenticatedRoutes.map((prop, key) => {
                    const {
                      layout,
                      path,
                      component,
                      exact
                    } = prop;
                    const routePath = layout + path;
                    console.log(`prop: ${JSON.stringify(prop, null, 2)}`);
                    return (
                      <Route path={routePath} component={component} exact={exact} key={key} />
                    );
                  })}
                </Suspense>
              </Switch>
              <AuthFooter isFluid />
            </div>
          </div>
      }
    </>
  );
};

const condition = authUser => !!authUser && !!authUser.active;

export default compose(
  withAuthentication,
  withEmailVerification,
  withAuthorization(condition)
)(AuthLayout);
