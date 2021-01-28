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
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
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
          ? <PageLoadingSpinner caller="EventView" />
          : <div id="Event">
            <TKoTHelmet
              name={state.dbEvent.header}
              path={`/Wananga/${state.dbEvent.evid}`}
              description={draftToText(state.dbEvent.content, '')}
              image={`${state.imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={state.imageDownloadURL}
              pageHeaderTitle={state.dbEvent.header}
              pageHeaderCaption=""
            />
            <Container className="bg-warning1 mt-5 pt-5">
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
