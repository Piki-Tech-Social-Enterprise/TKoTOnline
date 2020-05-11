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
import FirebaseInput from 'components/FirebaseInput';
import {
  formatBytes,
  formatInteger,
  fromCamelcaseToTitlecase
} from 'components/App/Utilities';
import * as Roles from 'components/Domains/Roles';
import FunctionsHelper from 'components/App/FunctionsHelper';

const usersRef = '/images/users';
const userKeyFormat = '{uid}';
const userFilenameFormat = '{filename}';
const userPhotoFolderUrlFormat = `${usersRef}/${userKeyFormat}/`;
const userPhotoUrlFormat = `${userPhotoFolderUrlFormat}${userFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  confirmEmail: '',
  confirmPassword: '',
  displayName: '',
  email: '',
  password: '',
  photoURL: '',
  photoURLFile: null,
  providerData: [
    {
      email: '',
      providerId: 'password',
      uid: null,
    }
  ],
  roles: {
    basicRole: Roles.basicRole
  },
  uid: null
};
const AuthUserView = props => {
  const {
    uid: paramsUid
  } = props.match.params;
  const isProfile = paramsUid == null;
  const userOrProfileText = isProfile
    ? 'Profile'
    : 'User';
  const isNew = paramsUid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(INITIAL_STATE);
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
      } = user;
      const newActiveRoles = {};
      roles.map(role => {
        const isActveRole = Object.keys(activeRoles).findIndex(activeRole => activeRole === role) > -1;
        if ((role === name && checked) || (role !== name && isActveRole)) {
          newActiveRoles[role] = role;
        }
        return null;
      });
      setUser(u => ({
        ...u,
        roles: newActiveRoles
      }));
    } else {
      setUser(u => ({
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
    const maxImageFileSize = 2097152;
    const now = new Date();
    const {
      authUser,
      firebase
    } = props;
    const {
      uid: authUserId
    } = authUser;
    const {
      active,
      confirmEmail,
      confirmPassword,
      displayName,
      email,
      password,
      photoURLFile,
      providerData,
      roles
    } = user;
    let uid = user.uid;
    let photoURL = user.photoURL;
    let displayType = 'success';
    let displayTitle = `Update ${userOrProfileText} Successful`;
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
      } else if (!photoURL || !email || !displayName || !roles) {
        displayMessage = 'The Photo, Email, Display Name, and Roles are required fields.';
      } else if (photoURLFile && photoURLFile.size > maxImageFileSize) {
        const {
          size
        } = photoURLFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      }
      if (displayMessage === defaultDisplayMesssage) {
        if (isNew) {
          uid = await firebase.saveDbUser({});
          if (photoURLFile && photoURLFile.name) {
            photoURL = userPhotoUrlFormat
              .replace(userKeyFormat, uid)
              .replace(userFilenameFormat, photoURLFile.name);
          }
          if (providerData && providerData.length) {
            providerData[0].email = email;
            providerData[0].uid = uid;
          }
        }
        if (isProfile) {
          await firebase.updateProfile({
            displayName,
            photoURL
          });
        } else {
          const dbUser = {
            disabled: active,
            displayName,
            email,
            // emailVerified: false,
            password,
            // phoneNumber,
            photoURL,
            uid
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
              uid: authUserId,
              dbUser: dbUser
            }
          };
          const functionsHelper = new FunctionsHelper(functionsHelperOptions);
          const result = isNew
            ? await functionsHelper.postAsync()
            : await functionsHelper.putAsync();
          console.log(`${functionsHelperOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
        }
        await firebase.saveDbUser({
          active: active,
          created: now.toString(),
          createdBy: authUserId,
          displayName,
          email,
          photoURL,
          providerData,
          roles,
          uid: uid,
          updated: now.toString(),
          updatedBy: authUserId
        });
        if (photoURLFile) {
          await firebase.saveStorageFile(photoURL, photoURLFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
      }
    } catch (error) {
      displayType = 'error';
      displayTitle = `Update ${userOrProfileText} Failed`;
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
          uid
        } = match.params;
        const userPhotoFolderUrl = userPhotoFolderUrlFormat.replace(userKeyFormat, uid);
        const storageFiles = await firebase.getStorageFiles(userPhotoFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        if (isProfile) {
          await firebase.deleteDbUser(uid);
        } else {
          // TODO: Delete User via Admin SDK
        }
        swal.fire({
          type: 'success',
          title: `Delete ${userOrProfileText} Successful`,
          text: `Your ${userOrProfileText} has been deleted.`
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        type: 'error',
        title: `Delete ${userOrProfileText} Error`,
        html: displayMessage
      });
      console.log(`Delete ${userOrProfileText} Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    if (isProfile) {
      window.location.href = '/auth';
    } else {
      props.history.push('/auth/Users');
    }
  };
  const handlePhotoUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const photoURLFile = e.target.files[0];
      setUser(u => ({
        ...u,
        photoURLFile: photoURLFile
      }));
    }
  };
  useEffect(() => {
    const retrieveUser = async () => {
      const dbUser = paramsUid
        ? await props.firebase.getDbUserValue(paramsUid)
        : props.authUser;
      const {
        active,
        displayName,
        roles,
        email,
        photoURL,
        providerData,
        uid
      } = dbUser;
      setUser({
        active,
        displayName,
        roles,
        email,
        photoURL,
        providerData,
        uid
      });
    };
    if (isLoading) {
      if (!isNew) {
        retrieveUser();
      }
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isNew, isLoading, setIsLoading, paramsUid]);
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        {
          isLoading
            ? <LoadingOverlayModal color="text-white-50" />
            : <>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>Email</Label>
                          <InputGroup>
                            <Input placeholder="Email" name="email" value={user.email} onChange={handleChange} type="email" disabled={isProfile} />
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
                                <Input placeholder="Confirm Email" name="confirmEmail" value={user.confirmEmail} onChange={handleChange} type="email" />
                              </FormGroup>
                            </>
                        }
                        <FormGroup>
                          <Label>Password</Label>
                          <InputGroup>
                            <Input placeholder="Password (Leave blank to keep existing)" name="password" value={user.password} onChange={handleChange} type="password" disabled={isProfile} />
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
                                <Input placeholder="Confirm Password (Leave blank to keep existing)" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} type="password" />
                              </FormGroup>
                            </>
                        }
                        <FormGroup>
                          <Label>Display Name</Label>
                          <Input placeholder="Display Name" name="displayName" value={user.displayName} onChange={handleChange} type="text" />
                        </FormGroup>
                        {
                          !!user.roles['systemAdminRole'] || !!user.roles['adminRole']
                            ? <>
                              <FormGroup className="user-roles">
                                <Label>Roles</Label><br />
                                {
                                  Object.keys(Roles).map(role => {
                                    if (role === 'undefinedRole') return null;
                                    return <CustomInput label={fromCamelcaseToTitlecase(role.replace('Role', ''))} id={role} name={role} checked={!!user.roles[role]} onChange={handleChange} key={role} type="switch" />
                                  })
                                }
                              </FormGroup>
                            </>
                            : null
                        }
                        <FormGroup>
                          <Label>Active</Label><br />
                          <CustomInput label="" name="active" checked={user.active} onChange={handleChange} type="switch" id="UserActive" />
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
                          <Label>Photo</Label>
                          <FirebaseInput
                            value={user.photoURL}
                            onChange={handleChange}
                            downloadURLInputProps={{
                              id: 'photoURL',
                              name: 'photoURL',
                              placeholder: 'Photo',
                              type: 'text'
                            }}
                            downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                            downloadURLFileInputOnChange={handlePhotoUrlFileChange}
                            downloadURLFormat={userPhotoUrlFormat}
                            downloadURLFormatKeyName={userKeyFormat}
                            downloadURLFormatKeyValue={props.match.params.uid || props.authUser.uid}
                            downloadURLFormatFileName={userFilenameFormat}
                          />
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

export default withAuthorization(condition)(AuthUserView);
