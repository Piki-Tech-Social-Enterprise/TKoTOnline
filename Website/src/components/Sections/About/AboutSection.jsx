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
import LoadingSpinner from 'components/App/LoadingSpinner';
import Routes from 'components/Routes/routes';

const {
  aboutUs,
  projects
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
    <div className="tkot-section pt-4">
      <a id="Home" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <div className="about-image" style={{
        backgroundImage: `linear-gradient(183deg, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0)), url(${pageAboutImage})`
      }}>
        <Container className="py-5 text-center">
          <Row>
            <Col xs={12} sm={6} className="bg-danger1">
              <img alt="..." className="n-logo pt-2 my-1" src={require("assets/img/tkot/tkot-white-logo.png")} width="419" />
            </Col>
            <Col xs={12} sm={6} className="text-left text-white h5 pt-5 pt-sm-0 my-auto bg-warning1">
              <div className="my-3">
                {
                  state.isLoading
                    ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                    : <>
                      <span>{state.settings.homePageAboutDescription}</span>
                      <Button href={aboutUs} className="tkot-primary-red-bg-color-50-pc btn-outline-light my-3" color="white">
                        Learn more...
                      </Button>
                      {
                        state.settings.homePageVideoSourceUrl
                          ? <iframe
                            title="TKoT"
                            width="100%"
                            height="240"
                            src={state.settings.homePageVideoSourceUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          : null
                      }
                    </>
                }
              </div>
            </Col>
          </Row>
          {
            showClickScrollDownForMoreLink
              ? <a href={projects} className="text-decoration-none text-dark">
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
