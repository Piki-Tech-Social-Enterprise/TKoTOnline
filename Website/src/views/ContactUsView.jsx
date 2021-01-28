import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CustomInput
} from 'reactstrap';
import swal from 'sweetalert2';
import {
  withFirebase
} from 'components/Firebase';
import {
  defaultPageSetup
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const ContactUsView = props => {
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    subscribed: false,
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
    const checkedNames = ['subscribed'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    console.log(`name: ${name}, value: ${value}`);
    setContact(c => ({
      ...c,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleGotoParent = () => {
    props.history.push('/');
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
      message,
      subscribed
    } = contact;
    let displayIcon = 'error';
    let displayTitle = 'Contact failed';
    let displayMessage = '';
    try {
      if (!email || !firstName || !lastName || !message) {
        displayMessage = 'First Name, Last Name, Email and Message are required fields.';
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'Email is invalid.';
      } else {
        await firebase.contactRepository.saveDbContact({
          active: true,
          created: now.toString(),
          createdBy: email,
          firstName,
          lastName,
          email,
          message,
          subscribed,
          updated: now.toString(),
          updatedBy: email
        });
        displayIcon = 'success';
        displayTitle = 'Contact successfully sent';
        displayMessage = `Thank you ${firstName} ${lastName}, your registration was successful. We will send an email to ${email} soon.`;
        handleGotoParent();
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
  useEffect(() => {
    defaultPageSetup(true);
    return defaultPageSetup;
  });
  return (
    <>
      <HomeNavbar
        initalTransparent
        colorOnScrollValue={25}
      />
      <Container className="pt-5 px-5 mt-3">
        <Row>
          <Col className="px-0 mt-5">
            <h3 className="text-uppercase text-center">Contact Us</h3>
            <p>We would like to hear from you.</p>
            <Container className="p-0">
              <Row noGutters>
                <Col>
                  <Card>
                    <CardBody>
                      <Form noValidate onSubmit={handleSubmit}>
                        <FormGroup>
                          <Label>First Name</Label>
                          <Input placeholder="First Name" name="firstName" value={contact.firstName} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Last Name</Label>
                          <Input placeholder="Last Name" name="lastName" value={contact.lastName} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Email</Label>
                          <Input placeholder="Email" name="email" value={contact.email} onChange={handleChange} type="email" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Message</Label>
                          <Input placeholder="Message" name="message" value={contact.message} onChange={handleChange} type="textarea" className="mh-100" rows={5} />
                        </FormGroup>
                        <FormGroup>
                          <CustomInput
                            label="Sign up to our newsletter to be informed of upcoming wānanga, events and pānui."
                            name="subscribed"
                            checked={contact.subscribed}
                            onChange={handleChange}
                            type="switch"
                            id="contactSubscribed"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Send</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParent} disabled={isSubmitting}>Cancel</Button>
                        </FormGroup>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default withFirebase(ContactUsView);
