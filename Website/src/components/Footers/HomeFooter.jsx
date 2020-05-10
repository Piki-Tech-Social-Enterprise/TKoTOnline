import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Container,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';
import PropTypes from 'prop-types';
import SocialMedia from './SocialMedia';
import Routes from '../Routes/routes';

const HomeFooterLink = props => {
  const {
    to,
    title,
    text
  } = props;
  return (
    <Link to={to} title={title}>{text}</Link>
  );
};
const HomePrivacyLink = () => {
  return (
    <HomeFooterLink to="/PrivacyPolicy" title="Privacy Policy" text="Privacy" />
  );
};
const HomeTermsLink = () => {
  return (
    <HomeFooterLink to="/TermsOfUse" title="Terms of Use" text="Terms" />
  );
};
const HomeFooter = props => {
  const {
    isDefault,
    isFluid
  } = props;
  const {
    REACT_APP_WEB_NAME
  } = process.env;
  const thisYear = 1900 + new Date().getYear();
  const {
    communityLinks,
    newsFeed,
    // interactiveMap,
    volunteers,
    aboutUs,
    contactUs
  } = Routes;
  const {
    REACT_APP_PWA_BASE_URL
  } = process.env;
  return (
    <footer className={`footer${((isDefault && ' footer-default') || '')}`}>
      <Row className="footer-content">
        <Col xs={12} lg={3} className="footer-logo">
          <a href="/">
            <img alt="..." className="n-logo" width="150" src={require("assets/img/tkot/tkot-logo-512x512.png")} />
          </a>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Nav vertical className="footer-links">
            <NavItem>
              <NavLink href={communityLinks}>Community Links</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={newsFeed}>News Feed</NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink href={interactiveMap}>Interactive Map</NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink href={volunteers}>Volunteers</NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col xs={12} md={6} lg={3}>
          <Nav vertical className="footer-links">
            <NavItem>
              <NavLink href={aboutUs}>About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href={contactUs}>Contact Us</NavLink>
            </NavItem>
              <NavItem>
                <Button href={`${REACT_APP_PWA_BASE_URL}/public/Login`} outline>
                  Login
                </Button>
              </NavItem>
          </Nav>
        </Col>
        <Col xs={12} lg={3}>
          <SocialMedia size="40" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Container fluid={!!isFluid} className="float-left">
            <div className="copyright">
              {REACT_APP_WEB_NAME} &copy; {thisYear} <HomePrivacyLink /> &amp; <HomeTermsLink />
            </div>
          </Container>
        </Col>
      </Row>
    </footer>
  );
};

HomeFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default HomeFooter;
