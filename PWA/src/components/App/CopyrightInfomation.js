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
const CopyrightYear = props => {
  const {
    text,
    startYear
  } = props;
  const today = new Date();
  const thisYear = today.getFullYear();
  const years = [
    startYear
  ];
  if (thisYear > Number(startYear)) {
    years.push(thisYear);
  }
  return (
    <>
      {text} &copy; {years.join('-')} All rights reserved.
    </>
  );
};
const CopyrightInfomation = () => {
  const {
    REACT_APP_PWA_NAME,
    REACT_APP_PWA_BUILD_VERSION
  } = process.env;
  return (
    <div className="copyright">
      <CopyrightYear text={`${REACT_APP_PWA_NAME} v${REACT_APP_PWA_BUILD_VERSION}`} startYear="2020" /> <AuthPrivacyLink /> &amp; <AuthTermsLink />
    </div>
  )
}

export default CopyrightInfomation
