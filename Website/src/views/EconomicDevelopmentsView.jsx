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

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const EconomicDevelopmentsSection = lazy(async () => await import('components/Sections/EconomicDevelopments'));
const EconomicDevelopmentsView = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  useEffect(() => {
    defaultPageSetup(true);
    setState(s => ({
      ...s,
      isLoading: false
    }));
    return defaultPageSetup;
  }, [setState]);
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
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
