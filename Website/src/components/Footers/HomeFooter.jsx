import React, {
  useState
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
  Button
} from 'reactstrap';
import PropTypes from 'prop-types';
import SocialMedia from './SocialMedia';
import {
  withFirebase
} from 'components/Firebase';
import swal from 'sweetalert2';

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
    isFluid
  } = props;
  const {
    REACT_APP_WEB_NAME
  } = process.env;
  const thisYear = 1900 + new Date().getYear();
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
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
    let cid = contact.cid;
    let displayIcon = 'error';
    let displayTitle = 'Sign Up failed';
    let displayMessage = '';
    try {
      if (!email || !firstName || !lastName) {
        displayMessage = 'First Name, Last Name and Email are required fields.';
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'Email is invalid.';
      } else {
        cid = await firebase.saveDbContact({});
        await firebase.saveDbContact({
          active: true,
          created: now.toString(),
          createdBy: firstName,
          firstName,
          lastName,
          email,
          message,
          cid: cid,
          updated: now.toString(),
          updatedBy: firstName
        });
        displayIcon = 'success';
        displayTitle = 'Sign Up successful';
        displayMessage = `Thank you ${firstName} ${lastName}, your sign up was successful. We will send an email to ${email} soon.`;
        setContact(c => ({
          ...c,
          ...INITIAL_STATE
        }))
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
    <footer className={`footer${((isDefault && ' footer-default') || '')} bg-dark py-5`}>
      <Row className="footer-content">
        <Col xs={12} lg={4} className="footer-logo">
          <a href="/">
            <img alt="..." className="n-logo" width="250" src={require("assets/img/tkot/tkot-logo-white.png")} />
          </a>
        </Col>
        <Col xs={12} lg={4}>
          <p className="text-uppercase font-weight-bolder">Connect with us</p>
          <SocialMedia size="40" />
        </Col>
        <Col xs={12} lg={4}>
          <p className="text-uppercase font-weight-bolder">We’ll Keep You Updated</p>
          <Container className="pl-0">
            <Row>
              <Col>
                <p className="small">Sign up to our newsletter to be informed of upcoming wānanga, events and pānui.</p>
                <Form className="bg-warning1" noValidate onSubmit={handleSubmit}>
                  <Row noGutters>
                    <Col xs={12} sm={6} className="pr-1">
                      <FormGroup>
                        <Input placeholder="First Name" name="firstName" value={contact.firstName} onChange={handleChange} type="text" />
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={6} className="pl-1">
                      <FormGroup>
                        <Input placeholder="Last Name" name="lastName" value={contact.lastName} onChange={handleChange} type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Input placeholder="Email" name="email" value={contact.email} onChange={handleChange} type="email" />
                  </FormGroup>
                  <FormGroup>
                    <Button type="submit" color="light" size="lg" className="btn-round my-2" outline block disabled={isSubmitting}>Sign Up</Button>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Container>
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

export default withFirebase(HomeFooter);
