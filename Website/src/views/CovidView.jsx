import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col,
  Button
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
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const NewsFeedCaption = lazy(async () => await import('components/App/NewsFeedCaption'));
const CovidView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbCovid: null,
    imageDownloadURL: ''
  });
  useEffect(() => {
    const retrieveCovidValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        cvid
      } = match.params;
      const dbCovid = await firebase.getDbCovidValue(cvid);
      const {
        externalUrl,
        imageUrl
      } = dbCovid;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
        setState(s => ({
          ...s,
          isLoading: false,
          dbCovid: dbCovid,
          imageDownloadURL: imageDownloadURL
        }));
      }
    };
    if (state.isLoading) {
      retrieveCovidValue();
    }
  }, [props, state]);
  return (
    <>
      {
        state.isLoading
          ? <PageLoadingSpinner caller="CovidView" />
          : <div id="Covid">
            <TKoTHelmet
              name={state.dbCovid.header}
              path={`/Covid/${state.dbCovid.cvid}`}
              description={draftToText(state.dbCovid.content, '')}
              image={`${state.imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={state.imageDownloadURL}
              pageHeaderTitle={state.dbCovid.header}
              pageHeaderCaption={() => <NewsFeedCaption newsFeed={state.dbCovid} key="temp" />}
            />
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.dbCovid.content)) }}
                />
              </Row>
              {
                state.dbCovid.paMaiUrl
                  ? <>
                    <Row>
                      <Col>
                        <Button
                          href={state.dbCovid.paMaiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tkot-primary-red-bg-color btn-outline-dark"
                          color="white"
                          onClick={() => sendEvent(`Covid page`, 'Clicked "Pā Mai" button', state.dbCovid.header)}
                        >Pā Mai</Button>
                      </Col>
                    </Row>
                  </>
                  : null
              }
            </Container>
            <HomeFooter />
          </div>
      }
    </>
  );
};

export default withFirebase(CovidView);
