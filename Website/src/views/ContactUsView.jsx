import React, {useState, useEffect} from 'react';
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
const ContactUsView = props => {
  const defaultDisplayMesssage = 'Changes saved';
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

  const handleGotoParentList = () => {
    props.history.push('/auth/Contacts');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const now = new Date();
    const {
      firebase
    } = props;
    const {
      active,
      firstName,
      lastName,
      email,
      message
    } = contact;
    console.log(contact);
    let cid = contact.cid;
    let displayType = 'success';
    let displayTitle = 'Update Contact Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!email || !firstName || !lastName || !message) {
        displayMessage = 'Email, First name, Last name, Email';
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'Email is invalid.';
      } 
      if (displayMessage === defaultDisplayMesssage) {
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
        if (isNew) {
          handleGotoParentList();
        }

      }
        
    } catch (error) {
      displayType = 'error';
      displayTitle = 'Update Contact Failed';
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        type: displayType,
        title: displayTitle,
        html: displayMessage
      });
    }
  };

  useEffect(() => {

  })
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>CONTACT US</h3>
            <div className="panel-header panel-header-xs" />
        <Container className="content">
          <Row>
            <Col>
              <Card>
                {/* <h3>Contact</h3> */}
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
                          <Label>email</Label>
                          <Input placeholder="Last Name" name="email" value={contact.email} onChange={handleChange} type="email" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Message</Label>
                          <Input placeholder="Message" name="message" value={contact.message} onChange={handleChange} type="textarea" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
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

export default ContactUsView;
