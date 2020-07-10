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
  formatInteger
} from 'components/App/Utilities';

const iwiMembersRef = '/images/iwiMembers';
const iwiMemberKeyFormat = '{imid}';
const iwiMemberFilenameFormat = '{filename}';
const iwiMemberImageFolderUrlFormat = `${iwiMembersRef}/${iwiMemberKeyFormat}/`;
const iwiMemberImageUrlFormat = `${iwiMemberImageFolderUrlFormat}${iwiMemberFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  iwiMemberImageURL: '',
  iwiMemberImageURLFile: null,
  iwiMemberName: '',
  iwiMemberURL: '',
  imid: null
};
const AuthIwiMemberView = props => {
  const isNew = props.match.params.imid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [iwiMember, setIwiMember] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setIwiMember(nf => ({
      ...nf,
      [name]: useChecked
        ? checked
        : value
    }));
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
      uid
    } = authUser;
    const {
      active,
      iwiMemberImageURLFile,
      iwiMemberName,
      iwiMemberURL
    } = iwiMember;
    let imid = iwiMember.imid;
    let iwiMemberImageURL = iwiMember.iwiMemberImageURL;
    let displayIcon = 'error';
    let displayTitle = 'Save Iwi Member Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!iwiMemberImageURL || !iwiMemberName || !iwiMemberURL) {
        displayMessage = 'The Iwi Member Image URL, Iwi Member Name, and Iwi Member URL fields are required.';
      } else if (iwiMemberImageURLFile && iwiMemberImageURLFile.size > maxImageFileSize) {
        const {
          size
        } = iwiMemberImageURLFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else if (!iwiMemberURL.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayMessage = 'Must be a valid Iwi Member URL';
      } else {
        if (isNew) {
          imid = await firebase.saveDbIwiMember({});
          if (iwiMemberImageURLFile && iwiMemberImageURLFile.name) {
            iwiMemberImageURL = iwiMemberImageUrlFormat
              .replace(iwiMemberKeyFormat, imid)
              .replace(iwiMemberFilenameFormat, iwiMemberImageURLFile.name);
          }
        }
        await firebase.saveDbIwiMember({
          active: active,
          created: now.toString(),
          createdBy: uid,
          iwiMemberImageURL,
          iwiMemberName,
          iwiMemberURL,
          imid: imid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (iwiMemberImageURLFile) {
          await firebase.saveStorageFile(iwiMemberImageURL, iwiMemberImageURLFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
        displayIcon = 'success';
        displayTitle = 'Save Iwi Member Successful';
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
      if (!!result.value) {
        const {
          firebase,
          match
        } = props;
        const {
          imid
        } = match.params;
        const iwiMemberImageFolderUrl = iwiMemberImageFolderUrlFormat.replace(iwiMemberKeyFormat, imid);
        const storageFiles = await firebase.getStorageFiles(iwiMemberImageFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbIwiMember(imid);
        swal.fire({
          icon: 'success',
          title: 'Delete Iwi Member Successful',
          text: 'Your Iwi Member has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: 'Delete Iwi Member Error',
        html: displayMessage
      });
      console.log(`Delete Iwi Member Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/IwiMembers');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const iwiMemberImageURLFile = e.target.files[0];
      setIwiMember(im => ({
        ...im,
        iwiMemberImageURLFile: iwiMemberImageURLFile
      }));
    }
  };
  useEffect(() => {
    const retrieveIwiMember = async () => {
      const dbIwiMember = await props.firebase.getDbIwiMemberValue(props.match.params.imid);
      const {
        active,
        iwiMemberImageURL,
        iwiMemberName,
        iwiMemberURL,
        imid
      } = dbIwiMember;
      setIwiMember({
        active,
        iwiMemberImageURL,
        iwiMemberName,
        iwiMemberURL,
        imid
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveIwiMember();
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
            ? <LoadingOverlayModal color="text-light" />
            : <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={8}>
                  <Card>
                    {/* <h3>Iwi Member</h3> */}
                    <CardBody>
                      <FormGroup>
                        <Label>Iwi Member Name</Label>
                        <Input placeholder="Iwi Member Name" name="iwiMemberName" value={iwiMember.iwiMemberName} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Iwi Member URL</Label>
                        <Input placeholder="Iwi Member URL" name="iwiMemberURL" value={iwiMember.iwiMemberURL} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={iwiMember.active} onChange={handleChange} type="switch" id="iwiMemberActive" />
                      </FormGroup>
                      <FormGroup>
                        <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                        <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                        <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs={12} sm={4}>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>Iwi Member Image URL</Label>
                        <FirebaseInput
                          value={iwiMember.iwiMemberImageURL}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'iwiMemberImageURL',
                            name: 'iwiMemberImageURL',
                            placeholder: 'Iwi Member Image URL',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={iwiMemberImageUrlFormat}
                          downloadURLFormatKeyName={iwiMemberKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.imid}
                          downloadURLFormatFileName={iwiMemberFilenameFormat}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
        }
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthIwiMemberView);
