import React, {
  useEffect,
  useState,
  lazy
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  defaultPageSetup
} from 'components/App/Utilities';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const FacebookLinksSection = lazy(async () => await import('components/Sections/FacebookLinks'));
const FacebookLinksView = () => {
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
            <FacebookLinksSection containerClassName="mt-0 mt-lg-3" />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(FacebookLinksView);
