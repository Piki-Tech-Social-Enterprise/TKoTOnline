import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';

const AuthFooterLink = props => {
  const {
    to,
    title,
    text
  } = props;
  return (
    <Link to={to} title={title}>{text}</Link>
  );
};
const AuthPrivacyLink = () => {
  return (
    <AuthFooterLink to="/public/PrivacyPolicy" title="Privacy Policy" text="Privacy" />
  );
};
const AuthTermsLink = () => {
  return (
    <AuthFooterLink to="/public/TermsOfUse" title="Terms of Use" text="Terms" />
  );
};
const AuthFooter = props => {
    const {
      isDefault,
      isFluid
    } = props;
    const {
      REACT_APP_PWA_NAME
    } = process.env;
    const thisYear = 1900 + new Date().getYear();
    return (
      <footer className={`footer${((isDefault && ' footer-default') || '')}`}>
        <Container fluid={isFluid}>
          <div className="copyright">
            {REACT_APP_PWA_NAME} &copy; {thisYear} <AuthPrivacyLink /> &amp; <AuthTermsLink />
          </div>
        </Container>
      </footer>
    );
};

AuthFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default AuthFooter;
