import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  defaultPageSetup
} from 'components/App/Utilities';
import Routes from 'components/Routes/routes';
import {
  lazy
} from 'react-lazy-no-flicker';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const CovidSection = lazy(async () => await import('components/Sections/Covid'));
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
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const dbCovidList = await firebase.getDbCovidListAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbCovidList
      }));
    };
    defaultPageSetup(true);
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [props, isLoading]);
  return (
    <>
    {
      isLoading
        ? <LoadingSpinner
          outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
          innerClassName="m-5 p-5 text-center"
        />
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