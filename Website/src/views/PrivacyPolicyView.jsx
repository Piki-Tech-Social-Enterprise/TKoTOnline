import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';

const PrivacyPolicy = () => {
  const {
    REACT_APP_WEB_EMAIL
  } = process.env;
  return (
    <>
    <HomeNavbar />
    <Container className="p-5 mt-5">
      <Row>
        <Col className="px-0 mt-5">
          <h3>PRIVACY POLICY</h3>
          <p>We collect personal information from you, including information about your:</p>
          <ul>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Email Address</li>
          </ul>
          <p>We collect your personal information in order to:</p>
          <ul>
            <li>Send newsletter emails</li>
          </ul>
          <p>Providing some information is optional. If you choose not to enter your full name & email address, we cannot send you emails.</p>
          <p>We keep your information safe by using a secure connection and transmission of data and only allowing certain staff to access it.</p>
          <p>We keep your information for five years at which point we securely destroy it by securely erasing all digital copies.</p>
          <p>You have the right to ask for a copy of any personal information we hold about you, and to ask for it to be corrected if you think it is wrong. If you’d like to ask for a copy of your information, or to have it corrected, please contact us at <a href={`mailto:${REACT_APP_WEB_EMAIL}?subject=Privacy`} Policy>{REACT_APP_WEB_EMAIL}</a></p>
        </Col>
      </Row>
    </Container>
    <HomeFooter />
    </>
  );
};

export default PrivacyPolicy;