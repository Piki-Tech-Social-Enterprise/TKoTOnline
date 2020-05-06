
import React, {
  useState,
  useEffect
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
import LoadingOverlayModal from '../components/App/LoadingOverModal';
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
  const [isLoading, setIsLoading] = useState(false);
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
    console.log(`name: ${name}, value: ${value}, checked: ${checked}, isRole: ${isRole}`);
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
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const defaultDisplayMesssage = 'Changes saved';
    const now = new Date();
    const {
      active,
      firstName,
      lastName,
      email,
      phoneNumber,
      providerData,
      roles
    } = volunteer;
    console.log('mmmmmmmmmmmmmmmmmmmmmmmm', volunteer, isNew);
    let vid = null;
    let displayType = 'success';
    let displayTitle = `Update Volunteer Successful`;
    let displayMessage = defaultDisplayMesssage;
    try {
      if (isNew) {
        if (!email || !firstName || !lastName || !phoneNumber || !roles) {
          displayMessage = 'Email, First name, Last name, Phone number, and Roles are required fields.';
        } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          displayMessage = 'Email is invalid.';
        } else if ( phoneNumber.match(/^[1-9]\d*(?:\.\d+)?(?:[kmbt])$/i)) {
          displayMessage = 'Phone number is invalid.';
        }
      } 
      if (displayMessage === defaultDisplayMesssage) {
        console.log('here now', active, firstName, phoneNumber);
        await props.firebase.saveDbVolunteer({
          active: active,
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
    if (displayMessage) {
      swal.fire({
        type: displayType,
        title: displayTitle,
        html: displayMessage
      }).then((result) => {
        if(result){
          props.history.push('/');
        }

      });
    }
  };
  useEffect(() => {
    const test = '';
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  });
  return (
    <>
    <HomeNavbar />
    <Container>
    <Row>
      <h1 className="volunteer-title">Volunteer</h1>
    </Row>
    <Row>
    <Container className="volunteer-form">
        {
          isLoading
            ? <LoadingOverlayModal />
            : <>
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
                            <Input placeholder="Phone number" name="phoneNumber" value={volunteer.phoneNumber} onChange={handleChange} type="number"/>
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
                          <Label>Active</Label><br />
                          <CustomInput label="" name="active" checked={volunteer.active} onChange={handleChange} type="switch" id="VolunteerActive" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Cancel</Button>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </>
        }
    </Container>
    </Row>
    </Container>
    <HomeFooter />
    </>
  )
};

export default withFirebase(Volunteer);