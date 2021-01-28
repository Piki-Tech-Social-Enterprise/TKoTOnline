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

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const NewsFeedCaption = lazy(async () => await import('components/App/NewsFeedCaption'));
const NewsFeedView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbNewsFeed: null,
    imageDownloadURL: ''
  });
  useEffect(() => {
    const retrieveNewsFeedValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        nfid
      } = match.params;
      const dbNewsFeed = await firebase.newsFeedRepository.getDbNewsFeedValue(nfid);
      const {
        externalUrl,
        imageUrl
      } = dbNewsFeed;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.storageRepository.getStorageFileDownloadURL);
        setState(s => ({
          ...s,
          isLoading: false,
          dbNewsFeed: dbNewsFeed,
          imageDownloadURL: imageDownloadURL
        }));
      }
    };
    if (state.isLoading) {
      retrieveNewsFeedValue();
    }
  }, [props, state]);
  return (
    <>
      {
        state.isLoading
          ? <PageLoadingSpinner caller="NewsFeedView" />
          : <div id="NewsFeed">
            <TKoTHelmet
              name={state.dbNewsFeed.header}
              path={`/NewsFeeds/${state.dbNewsFeed.nfid}`}
              description={draftToText(state.dbNewsFeed.content, '')}
              image={`${state.imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={state.imageDownloadURL}
              pageHeaderTitle={state.dbNewsFeed.header}
              pageHeaderCaption={() => <NewsFeedCaption newsFeed={state.dbNewsFeed} key="temp" />}
            />
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.dbNewsFeed.content)) }}
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
