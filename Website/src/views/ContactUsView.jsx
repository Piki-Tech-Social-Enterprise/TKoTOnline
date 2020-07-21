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
  Button
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import swal from 'sweetalert2';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import {
  defaultPageSetup
} from 'components/App/Utilities';

const ContactUsView = props => {
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    cid: null
  };
  const [contact, setContact] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNew = true;
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
      message
    } = contact;
    let cid = contact.cid;
    let displayIcon = 'error';
    let displayTitle = 'Contact failed';
    let displayMessage = '';
    try {
      if (!email || !firstName || !lastName || !message) {
        displayMessage = 'First Name, Last Name, Email and Message are required fields.';
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'Email is invalid.';
      } else {
        if (isNew) {
          cid = await firebase.saveDbContact({});
        }
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
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>CONTACT</h3>
            <p>We would like to hear from you</p>
            <div className="panel-header panel-header-xs" />
            <Container className="content">
              <Row>
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
