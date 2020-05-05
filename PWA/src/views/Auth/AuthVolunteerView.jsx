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
    InputGroupAddon,
    InputGroupText,
    CustomInput,
    Button
  } from 'reactstrap';
  import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
  import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
  import swal from 'sweetalert2';
  import {
    fromCamelcaseToTitlecase
  } from 'components/App/Utilities';
  import * as Roles from 'components/Domains/Roles';
  import FunctionsHelper from 'components/App/FunctionsHelper';
  
  const INITIAL_STATE = {
    active: true,
    confirmEmail: '',
    confirmPassword: '',
    displayName: '',
    email: '',
    password: '',
    providerData: [
      {
        email: '',
        providerId: 'password',
        vid: null,
      }
    ],
    roles: {
      basicRole: Roles.basicRole
    },
    vid: null
  };
  const AuthVolunteerView = props => {
    const {
      vid: paramsVid
    } = props.match.params;
    const isProfile = paramsVid == null;
    const volunteerOrProfileText = isProfile
      ? 'Profile'
      : 'Volunteer';
    const isNew = paramsVid === 'New';
    const [isLoading, setIsLoading] = useState(true);
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
        authVolunteer,
        firebase
      } = props;
      const {
        vid: authVolunteerId
      } = authVolunteer;
      const {
        active,
        confirmEmail,
        confirmPassword,
        displayName,
        email,
        password,
        providerData,
        roles
      } = volunteer;
      let vid = volunteer.vid;
      let displayType = 'success';
      let displayTitle = `Update ${volunteerOrProfileText} Successful`;
      let displayMessage = defaultDisplayMesssage;
      try {
        if (isNew) {
          if (!email || !confirmEmail || !password || !confirmPassword || !displayName || !roles) {
            displayMessage = 'Email, Confirmed Email, Password, Confirmed Password, Display Name, and Roles are required fields.';
          } else if (email !== confirmEmail) {
            displayMessage = 'Email and Confirmed Email fields do not match.';
          } else if (password !== confirmPassword) {
            displayMessage = 'Password and Confirmed Password fields do not match.';
          } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            displayMessage = 'Email is invalid.';
          } else if (!password.match(/(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}/)) {
            displayMessage = 'Password is too weak. Needs to be 6 characters or more. It can be any combination of letters, numbers, and symbols (ASCII characters).';
          }
        } 
        if (displayMessage === defaultDisplayMesssage) {
          if (isNew) {
            vid = await firebase.saveDbVolunteer({});
            if (providerData && providerData.length) {
              providerData[0].email = email;
              providerData[0].vid = vid;
            }
          }
          if (isProfile) {
            await firebase.updateProfile({
              displayName
            });
          } else {
            const dbVolunteer = {
              disabled: active,
              displayName,
              email,
              // emailVerified: false,
              password,
              // phoneNumber,
              vid
            };
            const {
              REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL: GCF_URL
            } = process.env;
            const functionsHelperOptions = {
              baseUrl: GCF_URL,
              functionName: isNew
                ? 'setProfile'
                : 'updateProfile',
              bodyData: {
                vid: authVolunteerId,
                dbVolunteer: dbVolunteer
              }
            };
            const functionsHelper = new FunctionsHelper(functionsHelperOptions);
            const result = isNew
              ? await functionsHelper.postAsync()
              : await functionsHelper.putAsync();
            console.log(`${functionsHelperOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
          }
          await firebase.saveDbVolunteer({
            active: active,
            created: now.toString(),
            createdBy: authVolunteerId,
            displayName,
            email,
            providerData,
            roles,
            vid: vid,
            updated: now.toString(),
            updatedBy: authVolunteerId
          });
          if (isNew) {
            handleGotoParentList();
          }
        }
      } catch (error) {
        displayType = 'error';
        displayTitle = `Update ${volunteerOrProfileText} Failed`;
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
    const handleDeleteClick = async e => {
      e.preventDefault();
      let result = null;
      let displayMessage = null;
      try {
        result = await swal.fire({
          type: 'warning',
          title: 'Are you sure?',
          text: "You won't be able to undo this!",
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-outline-danger',
            cancelButton: 'btn btn-outline-link',
          }
        });
        if (!!result.value) {
          const {
            firebase,
            match
          } = props;
          const {
            vid
          } = match.params;
          if (isProfile) {
            await firebase.deleteDbVoluteer(vid);
          } 
          swal.fire({
            type: 'success',
            title: `Delete ${volunteerOrProfileText} Successful`,
            text: `Your ${volunteerOrProfileText} has been deleted.`
          });
          handleGotoParentList();
        }
      } catch (error) {
        displayMessage = error.message;
      }
      if (displayMessage) {
        swal.fire({
          type: 'error',
          title: `Delete ${volunteerOrProfileText} Error`,
          html: displayMessage
        });
        console.log(`Delete ${volunteerOrProfileText} Error: ${displayMessage}`);
      }
    };
    const handleGotoParentList = () => {
      if (isProfile) {
        window.location.href = '/auth';
      } else {
        props.history.push('/auth/Users');
      }
    };
    useEffect(() => {
      const retrieveVolunteer = async () => {
        const dbVolunteer = paramsVid
          ? await props.firebase.getDbVolunteerValue(paramsVid)
          : props.authVolunteer;
        const {
          active,
          displayName,
          roles,
          email,
          providerData,
          vid
        } = dbVolunteer;
        setVolunteer({
          active,
          displayName,
          roles,
          email,
          providerData,
          vid
        });
      };
      if (isLoading) {
        if (!isNew) {
            retrieveVolunteer();
        }
      }
      return () => {
        if (isLoading) {
          setIsLoading(false);
        }
      };
    }, [props, isNew, isLoading, setIsLoading, paramsVid]);
    return (
      <>
        <div className="panel-header panel-header-xs" />
        <Container className="content">
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
                            <Label>Email</Label>
                            <InputGroup>
                              <Input placeholder="Email" name="email" value={volunteer.email} onChange={handleChange} type="email" disabled={isProfile} />
                              {
                                !isProfile
                                  ? null
                                  : <>
                                    <InputGroupAddon className="clickable" addonType="append" onClick={props.firebase.changeEmail} >
                                      <InputGroupText className="pl-3">
                                        <i className="now-ui-icons objects_key-25" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                  </>
                              }
                            </InputGroup>
                          </FormGroup>
                          {
                            !isNew
                              ? null
                              : <>
                                <FormGroup>
                                  <Label>Confirm Email</Label>
                                  <Input placeholder="Confirm Email" name="confirmEmail" value={volunteer.confirmEmail} onChange={handleChange} type="email" />
                                </FormGroup>
                              </>
                          }
                          <FormGroup>
                            <Label>Password</Label>
                            <InputGroup>
                              <Input placeholder="Password (Leave blank to keep existing)" name="password" value={volunteer.password} onChange={handleChange} type="password" disabled={isProfile} />
                              {
                                !isProfile
                                  ? null
                                  : <>
                                    <InputGroupAddon className="clickable" addonType="append" onClick={props.firebase.changePassword} >
                                      <InputGroupText className="pl-3">
                                        <i className="now-ui-icons objects_key-25" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                  </>
                              }
                            </InputGroup>
                          </FormGroup>
                          {
                            (!isNew && isProfile)
                              ? null
                              : <>
                                <FormGroup>
                                  <Label>Confirm Password</Label>
                                  <Input placeholder="Confirm Password (Leave blank to keep existing)" name="confirmPassword" value={volunteer.confirmPassword} onChange={handleChange} type="password" />
                                </FormGroup>
                              </>
                          }
                          <FormGroup>
                            <Label>Display Name</Label>
                            <Input placeholder="Display Name" name="displayName" value={volunteer.displayName} onChange={handleChange} type="text" />
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
                            <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                            <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
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
  