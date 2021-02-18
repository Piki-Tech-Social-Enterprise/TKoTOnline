import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import Routes from 'components/Routes/routes';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-page-loading-spinner' */'components/App/PageLoadingSpinner'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter'));
const CovidSection = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-covid-section' */'components/Sections/Covid'));
const {
  // covidList,
  mediaListPage
} = Routes;
const CovidListView = props => {
  const {
    match
  } = props;
  const {
    path
  } = match;
  const isTKoTMedia = path === mediaListPage;
  const [state, setState] = useState({
    isLoading: true,
    dbCovidList: []
  });
  const {
    isLoading,
    dbCovidList
  } = state;
  useEffect(() => {
    let defaultPageSetup = {};
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const dbCovidList = await firebase.covidListRepository.getDbCovidListAsArray();
      const {
        defaultPageSetup: defaultPageSetupImported
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      defaultPageSetup = defaultPageSetupImported;
      defaultPageSetup(true);
      setState(s => ({
        ...s,
        isLoading: false,
        dbCovidList
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return () => {
      if (!isLoading) {
        defaultPageSetup();
      }
    };
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="CovidListView" />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <CovidSection
              containerClassName="mt-5"
              isTKoTMedia={isTKoTMedia}
              dbCovidList={dbCovidList}
            />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(CovidListView);
