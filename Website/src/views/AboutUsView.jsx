import React, {
  useEffect,
  useState,
  lazy,
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
  useWindowEvent
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  IwiChairsSection
} from 'components/Sections/IwiMembers';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    settings: {}
  });
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
    const {
      isLoading
    } = state;
    const retrieveSettingValues = async () => {
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
    // const handleIFrameBlur = () => {
    //   if (
    //     document.activeElement &&
    //     iframeRef.current &&
    //     iframeRef.current === document.activeElement
    //   ) {
    //     sendEvent('About Us page', 'Clicked TKoT video');
    //   }
    // };
    defaultPageSetup(true);
    if (isLoading) {
      retrieveSettingValues();
      // window.addEventListener('blur', handleIFrameBlur);
    }
    return () => {
      if (!isLoading) {
        // window.removeEventListener('blur', handleIFrameBlur);
        defaultPageSetup();
      }
    };
  }, [props, state]);
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <>
            <TKoTHelmet
              name="About Us"
              path="/AboutUs"
              description={draftToText(state.settings.aboutPageDescription, '')}
              image={`${REACT_APP_WEB_BASE_URL}${require("assets/img/tkot/tkot-logo-only-black.webp")}`}
            />
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <Container className="p-5 mt-5">
              <Row>
                <Col className="px-0 mt-5">
                  <h3>ABOUT US</h3>
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
                    className="my-3"
                    imageURL={state.settings.aboutPageTKoTBackOfficeStructureImageUrl}
                    width="1074"
                    lossless={true}
                    alt="TKoT Back Office Structure"
                    loadingIconSize="lg"
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
