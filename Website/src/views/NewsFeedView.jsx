import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import draftToHtml from 'draftjs-to-html';
import {
  draftToText,
  getSrc
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPreload: true */'components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import(/* webpackPreload: true */'components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
const NewsFeedCaption = lazy(async () => await import(/* webpackPrefetch: true */'components/App/NewsFeedCaption'));
const INITAL_STATE = {
  isLoading: true,
  dbNewsFeed: {},
  imageDownloadURL: ''
};
const NewsFeedView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbNewsFeed,
    imageDownloadURL
  } = state;
  const {
    header,
    nfid,
    content
  } = dbNewsFeed;
  useEffect(() => {
    const retrieveNewsFeedValue = async () => {
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
        'header'
      ];
      const dbNewsFeed = await newsFeedRepository.getDbNewsFeedValue(nfid, dbNewsFeedFieldNames);
      const {
        externalUrl,
        imageUrl
      } = dbNewsFeed;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, storageRepository.getStorageFileDownloadURL);
        setState(s => ({
          ...s,
          isLoading: false,
          dbNewsFeed,
          imageDownloadURL
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
              description={draftToText(content, '')}
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
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(content)) }}
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
