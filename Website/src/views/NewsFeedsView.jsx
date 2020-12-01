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
import Routes from 'components/Routes/routes';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const NewsFeedSection = lazy(async () => await import('components/Sections/NewsFeed'));
const {
  // newsFeeds,
  mediaListPage
} = Routes;
const NewsFeedsView = props => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    match
  } = props;
  const {
    path
  } = match;
  const isTKoTMedia = path === mediaListPage;
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
          <NewsFeedSection
            containerClassName="mt-5"
            isTKoTMedia={isTKoTMedia}
          />
          <HomeFooter />
        </>
    }
    </>
  );
};

export default withFirebase(NewsFeedsView);
