import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import lazy from 'react-lazy-no-flicker/lib/lazy';
import {
  withSuspense
} from 'components/App/Utilities';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-page-loading-spinner' */'components/App/PageLoadingSpinner'));
const TKoTHelmet = withSuspense(lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-tkot-helmet' */'components/App/TKoTHelmet')), 'app-tkot-helmet');
const HomeNavbar = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar')), 'app-home-navbar');
const HomeHeader = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-header' */'components/Headers/HomeHeader')), 'app-home-header');
const HomeFooter = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter')), 'components/Footers/HomeFooter');
const NewsFeedCaption = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-newsfeed-caption' */'components/App/NewsFeedCaption')), 'app-newsfeed-caption');
const INITAL_STATE = {
  isLoading: true,
  dbNewsFeed: {},
  imageDownloadURL: '',
  contentAsText: '',
  contentAsHtml: ''
};
const NewsFeedView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbNewsFeed,
    imageDownloadURL,
    contentAsText,
    contentAsHtml
  } = state;
  const {
    header,
    nfid
  } = dbNewsFeed;
  useEffect(() => {
    const retrieveNewsFeedValue = async () => {
      const {
        getSrc,
        draftToText
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      const {
        firebase,
        match
      } = props;
      const {
        newsFeedRepository,
        storageRepository
      } = firebase;
      const {
        nfid
      } = match.params;
      const dbNewsFeedFieldNames = [
        'externalUrl',
        'imageUrl',
        'header',
        'date',
        'category',
        'content'
      ];
      const dbNewsFeed = await newsFeedRepository.getDbNewsFeedValue(nfid, dbNewsFeedFieldNames);
      const {
        externalUrl,
        imageUrl,
        content
      } = dbNewsFeed;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, storageRepository.getStorageFileDownloadURL);
        const contentAsText = draftToText(content, '');
        const {
          default: draftToHtml
        } = await import(/* webpackPrefetch: true, webpackChunkName: 'draftjs-to-html' */'draftjs-to-html');
        const contentAsHtml = draftToHtml(JSON.parse(content || '{}'));
        setState(s => ({
          ...s,
          isLoading: false,
          dbNewsFeed,
          imageDownloadURL,
          contentAsText,
          contentAsHtml
        }));
      }
    };
    if (isLoading) {
      retrieveNewsFeedValue();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="NewsFeedView" />
          : <div id="NewsFeed">
            <TKoTHelmet
              name={header}
              path={`/NewsFeeds/${nfid}`}
              description={contentAsText}
              image={`${imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={imageDownloadURL}
              pageHeaderTitle={header}
              pageHeaderCaption={() => <NewsFeedCaption newsFeed={dbNewsFeed} key="temp" />}
            />
            <Container className="mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: contentAsHtml }}
                />
              </Row>
            </Container>
            <HomeFooter />
          </div>
      }
    </>
  );
};

export default withFirebase(NewsFeedView);
