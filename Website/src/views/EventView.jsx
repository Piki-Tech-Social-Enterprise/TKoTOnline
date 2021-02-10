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
const INITAL_STATE = {
  isLoading: true,
  dbEvent: {},
  imageDownloadURL: ''
};
const EventView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbEvent,
    imageDownloadURL
  } = state;
  const {
    header,
    evid,
    content
  } = dbEvent;
  useEffect(() => {
    const retrieveEventValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        evid
      } = match.params;
      const dbEventFieldNames = [
        'externalUrl',
        'imageUrl',
        'header',
        'evid',
        'content'
      ];
      const dbEvent = await firebase.eventsRepository.getDbEventValue(evid, dbEventFieldNames);
      const {
        externalUrl,
        imageUrl
      } = dbEvent;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.storageRepository.getStorageFileDownloadURL);
        setState(s => ({
          ...s,
          isLoading: false,
          dbEvent,
          imageDownloadURL
        }));
      }
    };
    if (isLoading) {
      retrieveEventValue();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="EventView" />
          : <div id="Event">
            <TKoTHelmet
              name={header}
              path={`/Wananga/${evid}`}
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
              pageHeaderCaption=""
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

export default withFirebase(EventView);
