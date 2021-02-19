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
const NewsFeedSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-newsfeed-section' */'components/Sections/NewsFeed')), 'app-newsfeed-section');
const {
  // newsFeeds,
  mediaListPage
} = Routes;
const INITIAL_STATE = {
  isLoading: true,
  dbSettings: {},
  dbNewsFeeds: []
};
const NewsFeedsView = props => {
  const {
    match
  } = props;
  const {
    path
  } = match;
  const isTKoTMedia = path === mediaListPage;
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    dbSettings,
    dbNewsFeeds
  } = state;
  useEffect(() => {
    let defaultPageSetup = {};
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const dbSettings = !isTKoTMedia
        ? await firebase.settingsRepository.getDbSettingsValues([
          'newsSectionDescription'
        ])
        : INITIAL_STATE.dbSettings;
      const dbNewsFeedsFieldNames = [
        'category',
        'isFeatured',
        'isTKoTMedia',
        'date',
        'content',
        'header',
        'imageUrl',
        'externalUrl',
        'nfid',
        'name',
        'url'
      ];
      const dbNewsFeeds = await firebase.newsFeedRepository.getDbNewsFeedsAsArray(false, 'isTKoTMedia', isTKoTMedia, NaN, dbNewsFeedsFieldNames);
      const {
        defaultPageSetup: defaultPageSetupImported
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      defaultPageSetup = defaultPageSetupImported;
      defaultPageSetup(true);
      setState(s => ({
        ...s,
        isLoading: false,
        dbSettings,
        dbNewsFeeds
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
  }, [props, isLoading, isTKoTMedia]);
  return (
    <>
      <HomeNavbar
        initalTransparent
        colorOnScrollValue={25}
      />
      <NewsFeedSection
        containerClassName="mt-5"
        isTKoTMedia={isTKoTMedia}
        newsSectionDescription={!isTKoTMedia
          ? dbSettings.newsSectionDescription
          : null}
        dbNewsFeeds={dbNewsFeeds}
        doNotRetrieveData={dbNewsFeeds.length === 0}
      />
      <HomeFooter />
    </>
  );
};

export default withFirebase(NewsFeedsView);
