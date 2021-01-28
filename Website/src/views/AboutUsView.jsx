import React, {
  useEffect,
  useState,
  useRef,
  useCallback
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
  defaultPageSetup,
  draftToText,
  useWindowEvent,
  fromCamelcaseToTitlecase
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  IwiChairsSection
} from 'components/Sections/IwiMembers';
import Routes from 'components/Routes/routes';
import {
  lazy
} from 'react-lazy-no-flicker';

const {
  aboutUs
} = Routes;
const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    settings: {}
  });
  const {
    isLoading
  } = state;
  const iframeRef = useRef(null);
  const iframeRefCallback = useCallback(node => {
    iframeRef.current = node;
  }, []);
  const handleIFrameBlur = () => {
    if (
      document.activeElement &&
      iframeRef.current &&
      iframeRef.current === document.activeElement
    ) {
      sendEvent('About Us page', 'Clicked TKoT video');
    }
  };
  useWindowEvent('blur', handleIFrameBlur);
  useEffect(() => {
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true);
      setState(s => ({
        ...s,
        isLoading: false,
        settings: dbSettings
      }));
    };
    defaultPageSetup(true);
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [props, isLoading]);
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  return (
    <>
      <TKoTHelmet
        name={fromCamelcaseToTitlecase(aboutUs.replace('/', ''))}
        path={aboutUs}
        description={state.isLoading
          ? 'Formed in 2006/7, the purpose of Te Kāhu o Taonui was to create a taumata for our Taitokerau Iwi Chairs to come together, to wānanga, share ideas and concerns with each other. To utilise the power of our collective Iwi to create more opportunities to benefit all of our whānau, hapū and Marae.'
          : draftToText(state.settings.aboutPageDescription, '')}
        image={`${REACT_APP_WEB_BASE_URL}${require("assets/img/tkot/tkot-logo-only-black.webp")}`}
      />
      {
        state.isLoading
          ? <PageLoadingSpinner caller="AboutUsView" />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <Container className="p-5 mt-5">
              <Row>
                <Col className="px-0 mt-5">
                  <h3 className="text-uppercase text-center">About Us</h3>
                  {
                    state.settings.homePageVideoSourceUrl
                      ? <iframe
                        title="TKoT"
                        width="100%"
                        height="320"
                        src={state.settings.homePageVideoSourceUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        ref={iframeRefCallback}
                        className="lazyload"
                      />
                      : null
                  }
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.settings.aboutPageDescription)) }}
                  />
                  <IwiChairsSection />
                  <div
                    className="mt-5 pt-5"
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.settings.aboutPageTKoTBackOfficeStructureDescription || '{}')) }}
                  />
                  <FirebaseImage
                    className="my-3 w-100"
                    imageURL={state.settings.aboutPageTKoTBackOfficeStructureImageUrl}
                    width="1074"
                    lossless={true}
                    alt="TKoT Back Office Structure"
                    loadingIconSize="lg"
                    imageResize="lg"
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.settings.aboutPageExtraDescription)) }}
                  />
                </Col>
              </Row>
            </Container>
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(AboutUsView);
