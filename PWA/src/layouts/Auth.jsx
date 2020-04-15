import React, {
  createRef,
  useEffect,
  Suspense
} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import PerfectScrollbar from 'perfect-scrollbar';
import AuthSidebar from 'components/Sidebar/AuthSidebar';
import AuthNavbar from 'components/Navbars/AuthNavbar';
import AuthFooter from 'components/Footer/AuthFooter';
import authRoutes from 'authRoutes';

const Auth = props => {
  const mainPanel = createRef();
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
    const pushAction = 'PUSH';
    if (platform.indexOf(platformWin) > -1) {
      perfectScrollbar = new PerfectScrollbar(mainPanel.current);
      bodyCssClasses.toggle(perfectScrollbarOn);
    }
    if (props.history.action === pushAction) {
      mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    return () => {
      if (platform.indexOf(platformWin) > -1) {
        perfectScrollbar.destroy();
        bodyCssClasses.toggle(perfectScrollbarOn);
      }
    };
  }, [props, mainPanel]);
  return (
    <div className="wrapper">
      <AuthSidebar {...props} routes={authRoutes} backgroundColor={'blue'} />
      <div className="main-panel" ref={mainPanel}>
        <AuthNavbar {...props} routes={authRoutes} />
        <Switch>
          <Suspense fallback={<h1>TODO: Loading Overlay Modal...</h1>}>
            {authRoutes.map((prop, key) => {
              const {
                layout,
                path,
                component
              } = prop;
              const routePath = layout + path;
              console.log(`prop: ${JSON.stringify(prop, null, 2)}`);
              return (
                <Route path={routePath} component={component} key={key} />
              );
            })}
          </Suspense>
          <Redirect from="/auth" to="/auth/dashboard" />
        </Switch>
        <AuthFooter isFluid />
      </div>
    </div>
  );
};

export default Auth;