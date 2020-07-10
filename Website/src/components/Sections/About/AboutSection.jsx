import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import Routes from 'components/Routes/routes';

const {
  aboutUs
} = Routes;
const AboutSection = () => {
  return (
    <div className="tkot-section">
      <a id="About" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <div className="about-image" style={{
        backgroundImage: `url('${require('assets/img/tkot/tkot-about-background-image.png')}')`
      }}>
      </div>
      <Container className="py-5">
        <Row noGutters>
          <Col xs={12} sm={6}>
            <img alt="..." className="n-logo pt-2 mt-1" src={require("assets/img/tkot/tkot-blue-red-logo.png")} width="300" />
          </Col>
          <Col xs={12} sm={6}>
            <p>Blurb about how TKoT is set up now, summary of vision & goals</p>
            <div className="pt-4 mt-5">
              <Button href={aboutUs} outline color='dark' style={{
                color: 'inherit'
              }}>
                Learn more...
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutSection;
