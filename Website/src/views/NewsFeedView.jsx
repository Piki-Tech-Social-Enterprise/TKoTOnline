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
import LoadingSpinner from 'components/App/LoadingSpinner';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeHeader from 'components/Headers/HomeHeader';
import HomeFooter from 'components/Footers/HomeFooter';
import draftToHtml from 'draftjs-to-html';
import NewsFeedCaption from 'components/App/NewsFeedCaption';

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
        const imageDownloadURL = imageUrl.startsWith('/images/')
          ? await firebase.getStorageFileDownloadURL(imageUrl)
          : imageUrl
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
          ? <LoadingSpinner />
            : <div id="NewsFeed">
              <HomeNavbar
                initalTransparent={true}
                colorOnScrollValue={25}
              />
              <HomeHeader
                pageHeaderImage={state.imageDownloadURL}
                pageHeaderTitle={state.dbNewsFeed.header}
                pageHeaderCaption={() => <NewsFeedCaption newsFeed={state.dbNewsFeed} key="temp" />}
              />
              <Container className="bg-warning1 py-3">
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
