import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';

const Volunteer = () => {
  const {
    REACT_APP_WEB_EMAIL
  } = process.env;
  return (
    <>
    <HomeNavbar />
    <Container className="p-5 mt-5">
      <Row>
        <Col>
            <h1>Volunteer Page</h1>
        </Col>
      </Row>
    </Container>
    <HomeFooter />
    </>
  );
};

export default Volunteer;