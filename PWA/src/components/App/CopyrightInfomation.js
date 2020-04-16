import React from 'react';
import {
  Link
} from 'react-router-dom';

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
const CopyrightInfomation = () => {
  const {
    REACT_APP_PWA_NAME,
    REACT_APP_PWA_BUILD_VERSION
  } = process.env;
  const thisYear = 1900 + new Date().getYear();
  return (
    <div className="copyright">
      {REACT_APP_PWA_NAME} v{REACT_APP_PWA_BUILD_VERSION} &copy; {thisYear} <AuthPrivacyLink /> &amp; <AuthTermsLink />
    </div>
  )
}

export default CopyrightInfomation
