import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-page-loading-spinner' */'components/App/PageLoadingSpinner'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter'));
const ResourcesSection = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-resources-section' */'components/Sections/Resources'));
const ResourcesView = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    isLoading
  } = state;
  useEffect(() => {
    let defaultPageSetup = {};
    const pageSetup = async () => {
      const {
        defaultPageSetup: defaultPageSetupImported
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      defaultPageSetup = defaultPageSetupImported;
      defaultPageSetup(true);
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="ResourcesView" />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <ResourcesSection containerClassName="mt-0 mt-lg-3" />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(ResourcesView);
