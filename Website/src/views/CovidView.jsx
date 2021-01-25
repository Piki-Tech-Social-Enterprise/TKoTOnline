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

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
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
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
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
            </Container>
            <HomeFooter />
          </div>
      }
    </>
  );
};

export default withFirebase(CovidView);
