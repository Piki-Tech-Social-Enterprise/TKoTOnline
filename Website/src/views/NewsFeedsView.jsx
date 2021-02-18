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
const NewsFeedSection = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-newsfeed-section' */'components/Sections/NewsFeed'));
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
    return defaultPageSetup;
  }, [props, isLoading, isTKoTMedia]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="NewsFeedsView" />
          : <>
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
            />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(NewsFeedsView);
