import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import Routes from 'components/Routes/routes';
import lazy from 'react-lazy-no-flicker/lib/lazy';
import {
  withSuspense
} from 'components/App/Utilities';

const HomeNavbar = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar')), 'app-home-navbar');
const HomeFooter = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter')), 'components/Footers/HomeFooter');
const CovidSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-covid-section' */'components/Sections/Covid')), 'app-covid-section');
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
      <HomeNavbar
        initalTransparent
        colorOnScrollValue={25}
      />
      <CovidSection
        containerClassName="mt-5"
        isTKoTMedia={isTKoTMedia}
        dbCovidList={dbCovidList}
        doNotRetrieveData={dbCovidList.length === 0}
      />
      <HomeFooter />
    </>
  );
};

export default withFirebase(CovidListView);
