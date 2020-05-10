import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';

const ContactUsView = () => {
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>CONTACT US</h3>
            <p>TODO: Contact Us Content</p>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default ContactUsView;
