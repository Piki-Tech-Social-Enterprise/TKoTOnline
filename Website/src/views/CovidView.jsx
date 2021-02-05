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
const INITAL_STATE = {
  isLoading: true,
  dbCovid: {},
  imageDownloadURL: ''
};
const CovidView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbCovid,
    imageDownloadURL
  } = state;
  const {
    header,
    cvid,
    content,
    paMaiUrl
  } = dbCovid;
  useEffect(() => {
    const retrieveCovidValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        cvid
      } = match.params;
      const dbCovidFieldNames = [
        'externalUrl',
        'imageUrl',
        'category',
        'header',
        'cid',
        'content',
        'paMaiUrl'
      ];
      const dbCovid = await firebase.covidListRepository.getDbCovidValue(cvid, dbCovidFieldNames);
      const {
        externalUrl,
        imageUrl
      } = dbCovid;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.storageRepository.getStorageFileDownloadURL);
        setState(s => ({
          ...s,
          isLoading: false,
          dbCovid: dbCovid,
          imageDownloadURL
        }));
      }
    };
    if (isLoading) {
      retrieveCovidValue();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="CovidView" />
          : <div id="Covid">
            <TKoTHelmet
              name={header}
              path={`/Covid/${cvid}`}
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
              pageHeaderCaption={() => <NewsFeedCaption newsFeed={dbCovid} key="temp" />}
            />
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(content)) }}
                />
              </Row>
              {
                paMaiUrl
                  ? <>
                    <Row>
                      <Col>
                        <Button
                          href={paMaiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tkot-primary-red-bg-color btn-outline-dark"
                          color="white"
                          onClick={() => sendEvent(`Covid page`, 'Clicked "Pā Mai" button', header)}
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
