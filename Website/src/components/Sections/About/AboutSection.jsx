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
      <a id="About" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <div className="about-image" style={{
        backgroundImage: `url('${require('assets/img/tkot/tkot-about-background-image.png')}')`
      }}>
      </div>
      <Container className="py-5 text-center">
        <Row noGutters>
          <Col xs={12} sm={6}>
            <img alt="..." className="n-logo pt-2 mt-1" src={require("assets/img/tkot/tkot-blue-red-logo.png")} width="300" />
          </Col>
          <Col xs={12} sm={6} className="text-left">
            {
              state.isLoading
                ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                : <p>{state.settings.homePageAboutDescription}</p>
            }
            <div className="pt-4 mt-3">
              <Button href={aboutUs} outline color='dark' style={{
                color: 'inherit'
              }}>
                Learn more...
              </Button>
            </div>
          </Col>
        </Row>
        <a href={projects} className="text-decoration-none text-dark">
          <p className="my-0 mt-5"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
        </a>
      </Container>
    </div>
  );
};

export default withFirebase(AboutSection);
