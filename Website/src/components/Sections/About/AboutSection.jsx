import React, {
  useState,
  useEffect
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
import {
  lazy
} from 'react-lazy-no-flicker';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const {
  aboutUs,
  projectsAnchor
} = Routes;
const INITIAL_STATE = {
  isLoading: true,
  backgroundImage: 'linear-gradient(183deg, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0))'
};
const AboutSection = props => {
  const {
    pageAboutDescription,
    showClickScrollDownForMoreLink
  } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    backgroundImage
  } = state;
  useEffect(() => {
    const pageSetup = async () => {
      const {
        pageAboutImage
      } = props;
      const backgroundImage = `${INITIAL_STATE.backgroundImage}, url(${pageAboutImage})`;
      setState(s => ({
        ...s,
        isLoading: false,
        backgroundImage
      }));
    };
    if (isLoading) {
      pageSetup();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
          : <>
            <div className="tkot-section">
              <a id="Home" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
              <div className="about-image" style={{
                backgroundImage
              }}>
                <Container className="py-5 text-center">
                  <Row>
                    <Col xs={12} sm={6} className="bg-danger1">
                      <img alt="..." className="hero-image-tkot-logo pt-2 my-1 lazyload" data-src={tkotImage} src={tkotImage} width="300" height="267" />
                    </Col>
                    <Col xs={12} sm={6} className="text-left text-white h5 pt-5 pt-sm-0 my-auto bg-warning1">
                      <div className="my-3">
                        <span>{pageAboutDescription}</span><br />
                        <Button
                          href={aboutUs}
                          className="tkot-primary-red-bg-color-50-pc btn-outline-light my-3 mt-lg-5 mb-lg-1"
                          color="white"
                          onClick={() => sendEvent('Home page', 'Clicked "Learn More..." button')}
                        >Learn more...</Button>
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
          </>
      }
    </>
  );
};

export default withFirebase(AboutSection);
