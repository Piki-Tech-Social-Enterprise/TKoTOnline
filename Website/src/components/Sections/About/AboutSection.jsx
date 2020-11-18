import React, {
  useState,
  useEffect,
  lazy
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
import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import tkotImage from '../../../assets/img/tkot/tkot-white-logo.webp';
// import tkotVideo from '../../../assets/videos/v2.mp4';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const {
  aboutUs,
  projectsAnchor
} = Routes;
const AboutSection = props => {
  const {
    pageAboutImage,
    showClickScrollDownForMoreLink
  } = props;
  const [state, setState] = useState({
    isLoading: true,
    settings: {}
  });
  useEffect(() => {
    const {
      isLoading
    } = state;
    const getData = async () => {
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
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <div className="tkot-section">
      <a id="Home" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <div className="about-image" style={{
        backgroundImage: `linear-gradient(183deg, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0)), url(${pageAboutImage})`
      }}>
        <Container className="py-5 text-center">
          <Row>
            <Col xs={12} sm={6} className="bg-danger1">
              <img alt="..." className="n-logo pt-2 my-1 lazyload w-100" data-src={tkotImage} style={{
                maxWidth: 419
              }} />
              {/* <div className="videoHeader">
                <video playsInline autoPlay loop muted>
                  <source
                    type="video/mp4"
                    src={tkotVideo}
                  />
                </video>
              </div> */}
            </Col>
            <Col xs={12} sm={6} className="text-left text-white h5 pt-5 pt-sm-0 my-auto bg-warning1">
              <div className="my-3">
                {
                  state.isLoading
                    ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                    : <>
                      <span>{state.settings.homePageAboutDescription}</span><br />
                      <Button
                        href={aboutUs}
                        className="tkot-primary-red-bg-color-50-pc btn-outline-light my-3 mt-lg-5 mb-lg-1"
                        color="white"
                        onClick={() => sendEvent('Home page', 'Clicked "Learn More..." button')}
                      >Learn more...
                      </Button>
                    </>
                }
              </div>
            </Col>
          </Row>
          {
            showClickScrollDownForMoreLink
              ? <a href={projectsAnchor} className="text-decoration-none text-dark">
                <p className="my-0 mt-5"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
              </a>
              : null
          }
        </Container>
      </div>
    </div>
  );
};

export default withFirebase(AboutSection);
