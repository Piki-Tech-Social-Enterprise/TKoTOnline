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

const usersRef = '/images/users';
const userKeyFormat = '{uid}';
const userFilenameFormat = '{filename}';
const userPhotoFolderUrlFormat = `${usersRef}/${userKeyFormat}/`;
const userPhotoUrlFormat = `${userPhotoFolderUrlFormat}${userFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  displayName: '',
  email: '',
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
  const isNew = props.match.params.uid === 'New';
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
      displayName,
      email,
      photoURLFile,
      providerData,
      roles
    } = user;
    let uid = user.uid;
    let photoURL = user.photoURL;
    let displayType = 'success';
    let displayTitle = 'Update User Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!photoURL || !email || !displayName || !roles) {
        displayMessage = 'The Photo, Email, Display Name, and Roles fields are required.';
      } else
        if (photoURLFile && photoURLFile.size > maxImageFileSize) {
          const {
            size
          } = photoURLFile;
          throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        } else {
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
      displayTitle = 'Update User Failed';
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
        await firebase.deleteDbUser(uid);
        swal.fire({
          type: 'success',
          title: 'Delete User Successful',
          text: 'Your User has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        type: 'error',
        title: 'Delete User Error',
        html: displayMessage
      });
      console.log(`Delete User Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/Users');
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
      const dbUser = await props.firebase.getDbUserValue(props.match.params.uid);
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
  }, [props, isNew, isLoading, setIsLoading]);
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
                          <Input placeholder="Email" name="email" value={user.email} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Display Name</Label>
                          <Input placeholder="Display Name" name="displayName" value={user.displayName} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup className="user-roles">
                          <Label>Roles</Label><br />
                          {
                            Object.keys(Roles).map(role => {
                              if (role === 'undefinedRole') return null;
                              return <CustomInput label={fromCamelcaseToTitlecase(role.replace('Role', ''))} id={role} name={role} checked={!!user.roles[role]} onChange={handleChange} key={role} type="switch" />
                            })
                          }
                        </FormGroup>
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
                            downloadURLFormatKeyValue={props.match.params.uid}
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
