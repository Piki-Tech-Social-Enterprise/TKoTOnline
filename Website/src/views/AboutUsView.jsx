import React, {useEffect, useState} from 'react';
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

const AboutUsView = props => {

  const [aboutPageDescription, setAboutState] = useState ([]);

useEffect(() => {

  const retrieveSettingValues = async () => {
    const {
      firebase
    } = props;
    const dbSettings = await firebase.getDbSettingsValues(true);
    setAboutState(((dbSettings && dbSettings.aboutPageDescription) || ''));
  }

  retrieveSettingValues();
}, [props])
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>ABOUT US</h3>
            <p>{aboutPageDescription}</p>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default withFirebase(AboutUsView);
