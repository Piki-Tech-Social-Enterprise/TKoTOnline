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
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import draftToHtml from 'draftjs-to-html';
import {
  defaultPageSetup
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  IwiChairsSection
} from 'components/Sections/IwiMembers';

const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    settings: {}
  });
  const iframeRef = useRef(null);
  const iframeRefCallback = useCallback(node => {
    iframeRef.current = node;
  }, []);
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
    }
    const handleIFrameBlur = () => {
      if (
        document.activeElement &&
        iframeRef.current &&
        iframeRef.current === document.activeElement
      ) {
        sendEvent('About Us page', 'Clicked TKoT video');
      }
    };
    defaultPageSetup(true);
    if (state.isLoading) {
      retrieveSettingValues();
      window.addEventListener('blur', handleIFrameBlur);
    }
    return () => {
      if (!isLoading) {
        window.removeEventListener('blur', handleIFrameBlur);
        defaultPageSetup();
      }
    };
  }, [props, state])
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <>
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
                      />
                      : null
                  }
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.settings.aboutPageDescription)) }}
                  />
                  <IwiChairsSection />
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
