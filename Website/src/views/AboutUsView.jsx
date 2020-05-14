import React, {
  useEffect,
  useState
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

const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    aboutPageDescription: ''
  });
  useEffect(() => {
    const retrieveSettingValues = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true);
      setState(s => ({
        ...s,
        isLoading: false,
        aboutPageDescription: ((dbSettings && dbSettings.aboutPageDescription) || s.aboutPageDescription || '')
      }));
    }
    if (state.isLoading) {
      retrieveSettingValues();
    }
  }, [props, state])
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>ABOUT US</h3>
            {
              state.isLoading
                ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                : <p>{state.aboutPageDescription}</p>
            }
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default withFirebase(AboutUsView);
