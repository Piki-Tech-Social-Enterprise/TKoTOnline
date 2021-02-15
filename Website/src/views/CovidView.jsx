import React, {
  useEffect,
  useState
} from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Button
// } from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
// import draftToHtml from 'draftjs-to-html';
// import {
//   draftToText,
//   getSrc
// } from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Button'));
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true */'components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import(/* webpackPrefetch: true */'components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
const NewsFeedCaption = lazy(async () => await import(/* webpackPrefetch: true */'components/App/NewsFeedCaption'));
const INITAL_STATE = {
  isLoading: true,
  dbCovid: {},
  imageDownloadURL: '',
  contentAsText: '',
  contentAsHtml: ''
};
const CovidView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbCovid,
    imageDownloadURL,
    contentAsText,
    contentAsHtml
  } = state;
  const {
    header,
    cvid,
    paMaiUrl
  } = dbCovid;
  useEffect(() => {
    const retrieveCovidValue = async () => {
      const {
        getSrc,
        draftToText
      } = await import('components/App/Utilities');
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
        imageUrl,
        content
      } = dbCovid;
      if (externalUrl) {
        window.location.href = externalUrl;
      } else {
        const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.storageRepository.getStorageFileDownloadURL);
        const contentAsText = draftToText(content, '');
        const {
          default: draftToHtml
        } = await import(/* webpackPrefetch: true */'draftjs-to-html');
        const contentAsHtml = draftToHtml(JSON.parse(content || '{}'));
        setState(s => ({
          ...s,
          isLoading: false,
          dbCovid: dbCovid,
          imageDownloadURL,
          contentAsText,
          contentAsHtml
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
              pageHeaderCaption={() => <NewsFeedCaption newsFeed={dbCovid} key="temp" />}
            />
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: contentAsHtml }}
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
