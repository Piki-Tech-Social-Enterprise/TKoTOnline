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
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import AuthSidebar from 'components/Sidebar/AuthSidebar';
import AuthNavbar from 'components/Navbars/AuthNavbar';
import AuthFooter from 'components/Footer/AuthFooter';
import authRoutes from 'authRoutes';
import withAuthentication from 'components/Firebase/HighOrder/withAuthentication';
import withEmailVerification from 'components/Firebase/HighOrder/withEmailVerification';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import {
  compose
} from 'recompose';

const AuthLayout = props => {
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
          <Suspense fallback={<LoadingOverlayModal />}>
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
            <Redirect from="/auth" to="/auth/Dashboard" />
          </Suspense>
        </Switch>
        <AuthFooter isFluid />
      </div>
    </div>
  );
};

const condition = authUser => !!authUser && !!authUser.active;

export default compose(
  withAuthentication,
  withEmailVerification,
  withAuthorization(condition)
)(AuthLayout);
