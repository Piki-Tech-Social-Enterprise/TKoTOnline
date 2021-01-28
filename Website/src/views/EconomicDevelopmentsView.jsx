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
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const EconomicDevelopmentsSection = lazy(async () => await import('components/Sections/EconomicDevelopments'));
const EconomicDevelopmentsView = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    isLoading
  } = state;
  useEffect(() => {
    const pageSetup = async () => {
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    defaultPageSetup(true);
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <EconomicDevelopmentsSection containerClassName="mt-0 mt-lg-3" showViewTaitokerauEconomicSummit2020SiteButton />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(EconomicDevelopmentsView);
