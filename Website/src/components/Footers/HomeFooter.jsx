import React, {
  useState,
  lazy
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Nav
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  withFirebase
} from 'components/Firebase';
import swal from 'sweetalert2';
import {
  getNavItems
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const NavItems = lazy(async () => await import('components/App/NavItems'));
const Tooltips = lazy(async () => await import('components/App/Tooltips'));
const SocialMedia = lazy(async () => await import('./SocialMedia'));
const HomeFooterLink = props => {
  const {
    to,
    title,
    text
  } = props;
  return (
    <Link to={to} title={title} className="text-light text-decoration-none">{text}</Link>
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
    isHomePage
  } = props;
  const {
    pathname,
    hash
  } = window.location;
  const {
    REACT_APP_WEB_NAME
  } = process.env;
  const navItems = getNavItems(isHomePage);
  const thisYear = 1900 + new Date().getYear();
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    message: 'Sign Up to Newsletter',
    cid: null
  };
  const [contact, setContact] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    console.log(`name: ${name}, value: ${value}`);
    setContact(c => ({
      ...c,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const now = new Date();
    const {
      firebase
    } = props;
    const {
      firstName,
      lastName,
      email,
      message
    } = contact;
    let displayIcon = 'error';
    let displayTitle = 'Sign Up failed';
    let displayMessage = '';
    try {
      if (!email || !firstName || !lastName) {
        displayMessage = 'First Name, Last Name and Email are required fields.';
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'Email is invalid.';
      } else {
        await firebase.saveDbContact({
          active: true,
          created: now.toString(),
          createdBy: email,
          firstName,
          lastName,
          email,
          message,
          subscribed: true,
          updated: now.toString(),
          updatedBy: email
        });
        displayIcon = 'success';
        displayTitle = 'Sign Up successful';
        displayMessage = `Thank you ${firstName} ${lastName}, your sign up was successful. We will send an email to ${email} soon.`;
        setContact(c => ({
          ...c,
          ...INITIAL_STATE
        }));
        sendEvent(`${window.location.pathname} page`, `Signed up "${firstName} ${lastName}, ${email}"`);
      }
    } catch (error) {
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        icon: displayIcon,
        title: displayTitle,
        text: displayMessage
      });
    }
  };
  return (
    <>
      <div className="bg-dark text-light" style={{
        position: 'relative',
        top: '3rem'
      }}>
        <footer className={`footer${((isDefault && ' footer-default') || '')} bg-dark p-0 m-0 pt-5`} id="HomeFooter">
          {/* <Container> */}
          <Row className="footer-content px-0 mx-0">
            <Col xs={12} lg={3} className="footer-logo text-left text-lg-right bg-danger1">
              <a href="/">
                <img alt="..." className="n-logo py-3" width="289" src={require("assets/img/tkot/tkot-logo-white.webp")} />
              </a>
            </Col>
            <Col xs={12} lg={3} className="bg-light1 text-dark1">
              <Container className="mx-0 px-0 py-3 pt-sm-0">
                <Row noGutters>
                  <Col xs={12}>
                    <p className="text-uppercase font-weight-bolder text-lg-center">Rārangi Tono - Menu</p>
                    <Container className="p-0">
                      <Row noGutters>
                        <Col xs={6}>
                          <Nav navbar>
                            <NavItems
                              useScrollspyNavLinks={isHomePage}
                              pathname={pathname}
                              hash={hash}
                              items={navItems.filter(navItem => navItem.group === 'left')}
                              navItemClassName="left"
                              navLinkClassName="text-lg-center py-2 ml-0 ml-xl-5 box-social-text"
                              includeTooltips={true}
                            />
                          </Nav>
                        </Col>
                        <Col xs={6}>
                          <Nav navbar>
                            <NavItems
                              useScrollspyNavLinks={isHomePage}
                              pathname={pathname}
                              hash={hash}
                              items={navItems.filter(navItem => navItem.group === 'right')}
                              navItemClassName="right"
                              navLinkClassName="text-lg-center py-2 mr-0 mr-xl-5 box-social-text"
                              includeTooltips={true}
                            />
                          </Nav>
                        </Col>
                      </Row>
                    </Container>
                    <Tooltips
                      items={navItems}
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs={12} lg={3} className="bg-warning1">
              <Container className="mx-0 pl-0 py-3 pt-sm-0">
                <Row>
                  <Col>
                    <p className="text-uppercase font-weight-bolder text-lg-center">Hono Mai - We’ll Keep You Updated</p>
                    <p className="small">Sign up to our newsletter to be informed of upcoming wānanga, events and pānui.</p>
                    <Form className="bg-warning1" noValidate onSubmit={handleSubmit}>
                      <Row noGutters>
                        <Col xs={12} sm={6} className="pr-0 pr-sm-1">
                          <FormGroup>
                            <Input className="text-dark" placeholder="First Name/Ingoa Tuatahi" name="firstName" value={contact.firstName} onChange={handleChange} type="text" />
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6} className="pl-0 pl-sm-1">
                          <FormGroup>
                            <Input className="text-dark" placeholder="Last Name/Ingoa Tuarua" name="lastName" value={contact.lastName} onChange={handleChange} type="text" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Input className="text-dark" placeholder="Email/Īmēra" name="email" value={contact.email} onChange={handleChange} type="email" />
                      </FormGroup>
                      <FormGroup>
                        <Button type="submit" color="light" size="lg" className="tkot-primary-red-bg-color btn-outline-dark my-2" block disabled={isSubmitting}>Sign Up/Hono Mai</Button>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs={12} lg={3} className="bg-success1">
              <Container className="mx-0 px-0 py-3 pt-sm-0">
                <Row noGutters>
                  <Col xs={12}>
                    <p className="text-uppercase font-weight-bolder text-lg-center">Whakapā Mai - Contact Us</p>
                    <SocialMedia
                      links={[{
                        href: 'https://www.facebook.com/TeKahuOTaonui',
                        iconFaName: 'fab fa-facebook-f text-dark',
                        text: 'Facebook'
                      }, {
                        href: '/ContactUs',
                        iconFaName: 'fas fa-envelope text-dark',
                        text: 'admin@tkot.org.nz'
                      }, {
                        href: '',
                        iconFaName: 'fas fa-building text-dark',
                        text: 'PO Box 88, Kaeo\nNorthland 0448'
                      }]}
                      margin="my-2"
                      size="16"
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          {/* </Container> */}
        </footer>
      </div>
      <div className="bg-black text-light footer-copyright-container">
        <Row className="copyright p-0 m-0">
          <Col xs={12} lg={6} className="my-auto bg-danger1">
            <span className="my-0 mt-3 mt-sm-0 mt-lg-3">{REACT_APP_WEB_NAME} &copy; {thisYear} All rights reserved. <HomePrivacyLink /> &amp; <HomeTermsLink /></span>
          </Col>
          <Col xs={12} lg={6} className="my-auto text-lg-right bg-success1">
            <span className="text-uppercase font-weight-bolder my-0 mt-3 mt-sm-0 mt-lg-3 mr-3 mr-sm-0 mr-lg-5">Website co-curated by</span> <br className="d-md-none" />
            {/* <a href="#TKoTOnline" title="Making Everything Achievable Limited" target="_blank" rel="noopener noreferrer"> */}
            <img className="ml-0 ml-sm-3 created-by-logo-image" alt="Making Everything Achievable Limited" src={require('assets/img/tkot/mea-logo-165x165.webp')} />
            {/* </a> */}
            <a href="https://PikiTech.co.nz" title="Piki Tech Limited" target="_blank" rel="noopener noreferrer" onClick={() => sendEvent(`${window.location.pathname} page`, 'Clicked "PikiTech.co.nz" link')}>
              <img className="ml-3 created-by-logo-image" alt="Piki Tech Limited" src={require('assets/img/tkot/piki-tech-logo-white-transparent-165x165.webp')} />
            </a>
          </Col>
        </Row>
      </div>
    </>
  );
};

HomeFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default withFirebase(HomeFooter);
