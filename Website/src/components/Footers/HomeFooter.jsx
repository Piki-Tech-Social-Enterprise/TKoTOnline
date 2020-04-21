import React from 'react';
import {  Link } from 'react-router-dom';
import {  Container } from 'reactstrap';
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
         <SocialMedia />
        <Container fluid={isFluid}>
          <div className="copyright">
            {REACT_APP_WEB_NAME} &copy; {thisYear} <HomePrivacyLink /> &amp; <HomeTermsLink />
          </div>
        </Container>
      </footer>
    );
};

HomeFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default HomeFooter;
