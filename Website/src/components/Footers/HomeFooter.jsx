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
  NavLink
} from 'reactstrap';
import PropTypes from 'prop-types';
import SocialMedia from './SocialMedia';

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
    return (
      <footer className={`footer${((isDefault && ' footer-default') || '')}`}>
         <Row className="footer-content">
            <Col xs="12" lg="2" className='footer-logo'>
                  <img
                    alt="..."
                    className="n-logo"
                    width="150"
                    src={require("assets/img/tkot/tkot-logo-512x512.png")}
                  ></img>
              </Col>
              <Col xs="12" md="6" lg="2">
                <Nav vertical className="footer-links">
                  <NavItem>
                    <NavLink href="#">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Dashboard</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Contact Us</NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col xs="12" md="6" lg="2">
                <Nav vertical className="footer-links">
                  <NavItem>
                    <NavLink href="#">For Iwi</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Link</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Link</NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col xs="12" md="6" lg="2">
                <Nav vertical className="footer-links">
                  <NavItem>
                    <NavLink href="#">About Us</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Legal</NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col xs="12" lg="2">
                <SocialMedia size="40"/>
              </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Container fluid={isFluid} className="float-left">
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
