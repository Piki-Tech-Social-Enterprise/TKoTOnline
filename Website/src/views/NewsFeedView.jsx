import React, {
  useEffect,
  useState,
  lazy
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
import NewsFeedCaption from 'components/App/NewsFeedCaption';
import {
  getSrc
} from 'components/App/Utilities';

const LoadingSpinner = lazy(() => import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(() => import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(() => import('components/Headers/HomeHeader'));
const HomeFooter = lazy(() => import('components/Footers/HomeFooter'));
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
      const dbNewsFeed = await firebase.getDbNewsFeedValue(nfid);
      const {
        externalUrl,
        imageUrl
      } = dbNewsFeed;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
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
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <div id="NewsFeed">
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
