import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  defaultPageSetup
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const PrivacyPolicyView = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    isLoading
  } = state;
  const {
    REACT_APP_WEB_EMAIL
  } = process.env;
  useEffect(() => {
    const pageSetup = async () => {
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    defaultPageSetup(true);
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
  }, [isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <Container className="pt-5 px-5 mt-3">
              <Row>
                <Col className="px-0 mt-5">
                  <h3>PRIVACY POLICY</h3>
                  <p>We collect personal information from you, including information about your:</p>
                  <ul className="p">
                    <li>First Name</li>
                    <li>Last Name</li>
                    <li>Email Address</li>
                  </ul>
                  <p>We collect your personal information in order to:</p>
                  <ul className="p">
                    <li>Send newsletter emails</li>
                  </ul>
                  <p>Providing some information is optional. If you choose not to enter your full name & email address, we cannot send you emails.</p>
                  <p>We keep your information safe by using a secure connection and transmission of data and only allowing certain staff to access it.</p>
                  <p>We keep your information for five years at which point we securely destroy it by securely erasing all digital copies.</p>
                  <p>You have the right to ask for a copy of any personal information we hold about you, and to ask for it to be corrected if you think it is wrong. If you’d like to ask for a copy of your information, or to have it corrected, please contact us at <a href={`mailto:${REACT_APP_WEB_EMAIL}?subject=Privacy policy`} className="text-dark text-decoration-none">{REACT_APP_WEB_EMAIL}</a></p>
                </Col>
              </Row>
            </Container>
            <HomeFooter />
          </>
      }
    </>
  );
};

export default PrivacyPolicyView;
