import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
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
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const {
  aboutUs
} = Routes;
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-page-loading-spinner' */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-tkot-helmet' */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    aboutPageDescriptionAsHtml: '',
    aboutPageTKoTBackOfficeStructureDescriptionAsHtml: '',
    aboutPageExtraDescriptionAsHtml: ''
  });
  const {
    isLoading,
    settings,
    aboutPageDescriptionAsHtml,
    aboutPageTKoTBackOfficeStructureDescriptionAsHtml,
    aboutPageExtraDescriptionAsHtml
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
    let defaultPageSetup = {};
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.settingsRepository.getDbSettingsValues([
        'aboutPageDescription',
        'homePageVideoSourceUrl',
        'aboutPageTKoTBackOfficeStructureDescription',
        'aboutPageTKoTBackOfficeStructureImageUrl',
        'aboutPageExtraDescription'
      ]);
      const {
        aboutPageDescription,
        aboutPageTKoTBackOfficeStructureDescription,
        aboutPageExtraDescription
      } = dbSettings;
      const {
        default: draftToHtml
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'draftjs-to-html' */'draftjs-to-html');
      const aboutPageDescriptionAsHtml = draftToHtml(JSON.parse(aboutPageDescription || '{}'));
      const aboutPageTKoTBackOfficeStructureDescriptionAsHtml = draftToHtml(JSON.parse(aboutPageTKoTBackOfficeStructureDescription || '{}'));
      const aboutPageExtraDescriptionAsHtml = draftToHtml(JSON.parse(aboutPageExtraDescription || '{}'));
      const {
        defaultPageSetup: defaultPageSetupImported
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      defaultPageSetup = defaultPageSetupImported;
      defaultPageSetup(true);
      setState(s => ({
        ...s,
        isLoading: false,
        settings: dbSettings,
        aboutPageDescriptionAsHtml,
        aboutPageTKoTBackOfficeStructureDescriptionAsHtml,
        aboutPageExtraDescriptionAsHtml
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [props, isLoading]);
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  const tkotLogoOnlyBlackUrl = new URL('/static/img/tkot-logo-only-black.webp', REACT_APP_WEB_BASE_URL).toString();
  return (
    <>
      <TKoTHelmet
        name={fromCamelcaseToTitlecase(aboutUs.replace('/', ''))}
        path={aboutUs}
        description={isLoading
          ? 'Formed in 2006/7, the purpose of Te Kāhu o Taonui was to create a taumata for our Taitokerau Iwi Chairs to come together, to wānanga, share ideas and concerns with each other. To utilise the power of our collective Iwi to create more opportunities to benefit all of our whānau, hapū and Marae.'
          : draftToText(settings.aboutPageDescription, '')}
        image={tkotLogoOnlyBlackUrl}
        preloadImages={[
          tkotLogoOnlyBlackUrl
        ]}
      />
      {
        isLoading
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
                    settings.homePageVideoSourceUrl
                      ? <iframe
                        title="TKoT"
                        width="100%"
                        height="320"
                        src={settings.homePageVideoSourceUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        ref={iframeRefCallback}
                        className="lazyload"
                      />
                      : null
                  }
                  <div
                    dangerouslySetInnerHTML={{ __html: aboutPageDescriptionAsHtml }}
                  />
                  <IwiChairsSection />
                  <div
                    className="mt-5 pt-5"
                    dangerouslySetInnerHTML={{ __html: aboutPageTKoTBackOfficeStructureDescriptionAsHtml }}
                  />
                  <FirebaseImage
                    className="my-3 w-100"
                    imageURL={settings.aboutPageTKoTBackOfficeStructureImageUrl}
                    width="1074"
                    lossless={true}
                    alt="TKoT Back Office Structure"
                    loadingIconSize="lg"
                    imageResize="lg"
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: aboutPageExtraDescriptionAsHtml }}
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
