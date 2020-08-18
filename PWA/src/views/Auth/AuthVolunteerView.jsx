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
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import swal from 'sweetalert2';
import {
  fromCamelcaseToTitlecase
} from 'components/App/Utilities';
import * as Roles from 'components/Domains/VolunteerRoles';

const INITIAL_STATE = {
  active: true,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  roles: {
    volunteerRole: Roles.volunteerRole
  },
  details: {
    region: '',
    travelDistance: '',
    type: ''
  },
  vid: null
};
const AuthVolunteerView = props => {
  const isNew = props.match.params.vid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [volunteer, setVolunteer] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalEmail, setOriginalEmail] = useState([]);
  const {
    authUser
  } = props;
  const canUpdateRoles = authUser &&
    (!!authUser.roles['systemAdminRole'] ||
      !!authUser.roles['adminRole'] ||
      !!authUser.roles['volunteerCoordinatorRole']);
  const revisePhoneNumber = phoneNumber => {
    const startsWithPlusSignRegExp = /^\+/;
    const endsWithAlphanumbericsRegExp = /[\da-zA-Z]+/;
    const startsWithZeroRegExp = /^0/;
    let revisedPhoneNumber = phoneNumber;
    if (!startsWithPlusSignRegExp.test(phoneNumber) ||
      !endsWithAlphanumbericsRegExp.test(phoneNumber)) {
      if (startsWithZeroRegExp.test(revisedPhoneNumber)) {
        revisedPhoneNumber = revisedPhoneNumber.replace(startsWithZeroRegExp, '');
      }
      if (!startsWithPlusSignRegExp.test(revisedPhoneNumber)) {
        revisedPhoneNumber = `+64${revisedPhoneNumber}`;
      }
      if (!endsWithAlphanumbericsRegExp.test(revisedPhoneNumber)) {
        revisedPhoneNumber = `${revisedPhoneNumber}0`;
      }
    }
    return revisedPhoneNumber;
  };
  const isEmailUnique = async email => {
    const {
      firebase
    } = props;
    const functionsRepositoryOptions = {
      functionName: 'isUnique',
      data: {
        dbObjectName: 'volunteers',
        dbObjectFieldName: 'email',
        dbObjectFieldValue: email
      }
    };
    const result = await firebase.call(functionsRepositoryOptions);
    console.log(`${functionsRepositoryOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
    return result.data;
  };
  // const isEmailUniqueAlt = async email => {
  //   debugger;
  //   const {
  //     firebase,
  //     authUser
  //   } = props;
  //   const {
  //     REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL
  //   } = process.env;
  //   const functionsRepositoryOptions = {
  //     baseUrl: REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL,
  //     functionName: 'isUniqueAlt',
  //     bodyData: {
  //       data: {
  //         dbObjectName: 'volunteers',
  //         dbObjectFieldName: 'email',
  //         dbObjectFieldValue: email
  //       },
  //       context: {
  //         auth: {
  //           uid: authUser.uid
  //         }
  //       }
  //     }
  //   };
  //   const result = await firebase.postAsync(functionsRepositoryOptions);
  //   console.log(`${functionsRepositoryOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
  //   return result;
  // };
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
    } else if (name.startsWith('details.')) {
      const strReplace = name.replace('details.', '');
      setVolunteer(u => ({
        ...u,
        details: {
          ...u.details,
          [strReplace]: value
        }
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
      authUser,
      firebase
    } = props;
    const {
      uid
    } = authUser;
    const {
      active,
      firstName,
      lastName,
      email,
      phoneNumber,
      providerData,
      roles,
      details
    } = volunteer;
    let vid = volunteer.vid;
    let displayIcon = 'success';
    let displayTitle = `Update Volunteer Successful`;
    let displayMessage = defaultDisplayMesssage;
    try {
      if (isNew) {
        if (!email || !firstName || !lastName || !phoneNumber) {
          displayMessage = 'First name, Last name, Email, and Phone Number are required fields.';
        } else if (Object.entries(roles).length === 0 && canUpdateRoles) {
          displayIcon = 'error';
          displayTitle = `New Volunteer Failed`;
          displayMessage = 'You need to select a role';
        } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          displayMessage = 'Email is invalid.';
        } else if (phoneNumber.match(/^[1-9]\d*(?:\.\d+)?(?:[kmbt])$/i)) {
          displayMessage = 'Phone number is invalid.';
        } else if (!(await isEmailUnique(email))) {
          // } else if (!(await isEmailUniqueAlt(email))) {
          displayIcon = 'error';
          displayTitle = `New Volunteer Failed`;
          displayMessage = `'${email}' is already in use.`;
        }
      } else if (originalEmail !== email && !(await isEmailUnique(email))) {
        // } else if (originalEmail !== email && !(await isEmailUniqueAlt(email))) {
        displayIcon = 'error';
        displayTitle = `Existing Volunteer Failed`;
        displayMessage = `'${email}' is already in use.`;
      } else if (Object.entries(roles).length === 0 && canUpdateRoles) {
        displayIcon = 'error';
        displayTitle = `New Volunteer Failed`;
        displayMessage = 'You need to select a role';
      }
      if (displayMessage === defaultDisplayMesssage) {
        // debugger;
        const revisedPhoneNumber = revisePhoneNumber(phoneNumber);
        if (isNew) {
          vid = await firebase.saveDbVolunteer({
            active,
            created: now.toString(),
            createdBy: uid,
            firstName,
            lastName,
            details,
            phoneNumber: revisedPhoneNumber,
            email,
            providerData,
            roles,
            updated: now.toString(),
            updatedBy: uid
          });
          handleGotoParentList();
        } else {
          await firebase.saveDbVolunteer({
            active,
            firstName,
            lastName,
            phoneNumber: revisedPhoneNumber,
            email,
            providerData,
            roles,
            details,
            updated: now.toString(),
            updatedBy: uid,
            vid: vid
          });
        }
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = `Update Volunteer Failed`;
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        icon: displayIcon,
        title: displayTitle,
        html: displayMessage
      });
    }
  };
  const handleDeleteClick = async e => {
    e.preventDefault();
    let result = null;
    let displayMessage = null;
    try {
      result = await swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to undo this!",
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-outline-danger',
          cancelButton: 'btn btn-outline-link',
        }
      });
      if (result.isConfirmed) {
        const {
          firebase,
          match
        } = props;
        const {
          vid
        } = match.params;
        await firebase.deleteDbVolunteer(vid);
        swal.fire({
          icon: 'success',
          title: `Delete Volunteer Successful`,
          text: `Your Volunteer has been deleted.`
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: `Delete Volunteer Error`,
        html: displayMessage
      });
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/Volunteers');
  };
  useEffect(() => {
    const {
      firebase,
      match
    } = props;
    const retrieveVolunteer = async () => {
      const dbVolunteer = await firebase.getDbVolunteerValue(match.params.vid);
      const {
        active,
        firstName,
        lastName,
        phoneNumber,
        roles,
        email,
        providerData,
        vid,
        details
      } = dbVolunteer;
      setOriginalEmail(email);
      setVolunteer({
        active,
        firstName,
        lastName,
        phoneNumber,
        roles,
        email,
        providerData,
        vid,
        details: details || INITIAL_STATE.details
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveVolunteer();
      } else {
        setIsLoading(false);
      }
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isNew, isLoading, setIsLoading]);
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        {
          isLoading
            ? <LoadingOverlayModal color="text-aqua" />
            : <>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>First Name</Label>
                          <InputGroup>
                            <Input placeholder="First Name" name="firstName" value={volunteer.firstName} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Last Name</Label>
                          <InputGroup>
                            <Input placeholder="Last Name" name="lastName" value={volunteer.lastName} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Email</Label>
                          <InputGroup>
                            <Input placeholder="Email" name="email" value={volunteer.email} onChange={handleChange} type="email" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <InputGroup>
                            <Input placeholder="Phone Number" name="phoneNumber" value={volunteer.phoneNumber} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        {
                          canUpdateRoles
                            ? <>
                              <FormGroup className="volunteer-roles">
                                <Label>Roles</Label><br />
                                {
                                  Object.keys(Roles).map(role => {
                                    if (role === 'undefinedRole') return null;
                                    return <CustomInput label={fromCamelcaseToTitlecase(role.replace('Role', ''))} id={role} name={role} checked={!!volunteer.roles[role]} onChange={handleChange} key={role} type="switch" />
                                  })
                                }
                              </FormGroup>
                            </>
                            : null
                        }
                        <FormGroup>
                          <Label>Active</Label><br />
                          <CustomInput label="" name="active" checked={volunteer.active} onChange={handleChange} type="switch" id="VolunteerActive" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                          <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>Region</Label>
                          <InputGroup>
                            <Input placeholder="Region" name="details.region" value={volunteer.details.region} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Distance Willing to Travel</Label>
                          <InputGroup>
                            <Input placeholder="Travel Distance" name="details.travelDistance" value={volunteer.details.travelDistance} onChange={handleChange} type="number" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Type of Work</Label>
                          <InputGroup>
                            <Input placeholder="Type of Work" name="details.type" value={volunteer.details.type} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </>
        }
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthVolunteerView);
