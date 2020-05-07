
import React, {
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
  InputGroup,
  CustomInput,
  Button
} from 'reactstrap';
import swal from 'sweetalert2';
import {
  fromCamelcaseToTitlecase
} from 'components/App/Utilities';
import * as Roles from '../components/Domains/VolunteerRoles';
import {
  withFirebase
} from 'components/Firebase';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';

const Volunteer = props => {

  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roles: {
      volunteerRole: Roles.volunteerRole
    },
    vid: null
  };

  const isNew = true;
  const [volunteer, setVolunteer] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    const roles = Object.keys(Roles);
    const isRole = roles.findIndex(role => role === name) > -1;
    if (isRole) {
      const {
        roles: activeRoles
      } = volunteer;
      const newActiveRoles = {};
      roles.map(role => {
        const isActveRole = Object.keys(activeRoles).findIndex(activeRole => activeRole === role) > -1;
        if ((role === name && checked) || (role !== name && isActveRole)) {
          newActiveRoles[role] = role;
        }
        return null;
      });
      setVolunteer(u => ({
        ...u,
        roles: newActiveRoles
      }));
    } else {
      setVolunteer(u => ({
        ...u,
        [name]: useChecked
          ? checked
          : value
      }));
    }
  };

  const handleCanel = async () => {

    swal.fire({
      title: 'Cancel',
      icon: 'warning',
      text: 'Are you sure you want to cancel? this will return you to the home page',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then((result)=> {
      if(result.dismiss !== 'cancel'){
        props.history.push('/');
      }
    })
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const defaultDisplayMesssage = 'Changes saved';
    const now = new Date();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      providerData,
      roles
    } = volunteer;
    let vid = null;
    let displayType = 'success';
    let displayTitle = `Update Volunteer Successful`;
    let displayMessage = defaultDisplayMesssage;
    try {
      if (isNew) {
        if (!email || !firstName || !lastName || !phoneNumber || !roles) {
          displayType = 'error';
          displayTitle = `Update Volunteer Failed`;
          displayMessage = 'Email, First name, Last name, Phone number, and Roles are required fields.';
        } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          displayType = 'error';
          displayTitle = `Update Volunteer Failed`;
          displayMessage = 'Email is invalid.';
        } else if (!phoneNumber.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i)) {
          displayType = 'error';
          displayTitle = `Update Volunteer Failed`;
          displayMessage = 'Phone number is invalid.';
        }
      } 
      if (displayMessage === defaultDisplayMesssage) {
        await props.firebase.saveDbVolunteer({
          active: true,
          created: now.toString(),
          createdBy: firstName,
          firstName,
          lastName,
          phoneNumber,
          email,
          providerData,
          roles,
          vid: vid,
          updated: now.toString(),
          updatedBy: firstName
        });
      }
    } catch (error) {
      displayType = 'error';
      displayTitle = `Update Volunteer Failed`;
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayType !== 'error') {
      swal.fire({
        icon: displayType,
        title: displayTitle,
        html: displayMessage
      }).then((result) => {
        if(result){
          props.history.push('/');
        }
      });
    }else {
      swal.fire({
        icon: displayType,
        title: displayTitle,
        html: displayMessage
      })
    }
  };
  return (
    <>
    <HomeNavbar />
    <Container>
    <Row>
      <h2 className="volunteer-title">Volunteer Registration</h2>
    </Row>
    <Row>
    <Container className="volunteer-form">
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>First Name</Label>
                          <InputGroup>
                            <Input placeholder="First name" name="firstName" value={volunteer.firstName} onChange={handleChange} type="text"/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Last Name</Label>
                          <InputGroup>
                            <Input placeholder="Last name" name="lastName" value={volunteer.lastName} onChange={handleChange} type="text"/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Email</Label>
                          <InputGroup>
                            <Input placeholder="Email" name="email" value={volunteer.email} onChange={handleChange} type="email"/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <InputGroup>
                            <Input placeholder="Phone number" name="phoneNumber" value={volunteer.phoneNumber} onChange={handleChange} type="text"/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className="volunteer-roles">
                          <Label>Roles</Label><br />
                          {
                            Object.keys(Roles).map(role => {
                              if (role === 'undefinedRole') return null;
                              return <CustomInput label={fromCamelcaseToTitlecase(role.replace('Role', ''))} id={role} name={role} checked={!!volunteer.roles[role]} onChange={handleChange} key={role} type="switch" />
                            })
                          }
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="warning" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Regitster</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting} onClick={handleCanel}>Cancel</Button>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
    </Container>
    </Row>
    </Container>
    <HomeFooter />
    </>
  )
};

export default withFirebase(Volunteer);