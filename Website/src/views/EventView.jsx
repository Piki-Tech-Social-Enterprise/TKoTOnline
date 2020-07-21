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

const EventView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbEvent: null,
    imageDownloadURL: ''
  });
  useEffect(() => {
    const retrieveEventValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        evid
      } = match.params;
      const dbEvent = await firebase.getDbEventValue(evid);
      const {
        externalUrl,
        imageUrl
      } = dbEvent;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = imageUrl.startsWith('/images/')
          ? await firebase.getStorageFileDownloadURL(imageUrl)
          : imageUrl
        setState(s => ({
          ...s,
          isLoading: false,
          dbEvent: dbEvent,
          imageDownloadURL: imageDownloadURL
        }));
      }
    };
    if (state.isLoading) {
      retrieveEventValue();
    }
  }, [props, state]);
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner />
            : <div id="Event">
              <HomeNavbar
                initalTransparent={true}
                colorOnScrollValue={25}
              />
              <HomeHeader
                pageHeaderImage={state.imageDownloadURL}
                pageHeaderTitle={state.dbEvent.header}
                pageHeaderCaption=""
              />
              <Container className="bg-warning1 py-3">
                <Row>
                  <Col
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.dbEvent.content)) }}
                  />
                </Row>
              </Container>
              <HomeFooter />
            </div>
      }
    </>
  );
};

export default withFirebase(EventView);
