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
import FirebaseInput from 'components/Firebase/FirebaseInput';
import {
  formatBytes,
  formatInteger,
  getImageUrl,
  uploadFileToStorage
} from 'components/App/Utilities';
import DraftEditor from 'components/DraftEditor';

const iwiMembersRef = '/images/iwiMembers';
const iwiMemberKeyFormat = '{imid}';
const iwiMemberFilenameFormat = '{filename}';
const iwiMemberImageFolderUrlFormat = `${iwiMembersRef}/${iwiMemberKeyFormat}/`;
const iwiMemberImageUrlFormat = `${iwiMemberImageFolderUrlFormat}${iwiMemberFilenameFormat}`;
const iwiChairImageUrlFormat = `${iwiMemberImageFolderUrlFormat}${iwiMemberFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  iwiChairImageURL: '',
  iwiChairImageURLFile: null,
  iwiChairName: '',
  iwiChairProfile: '',
  iwiMemberImageURL: '',
  iwiMemberImageURLFile: null,
  iwiMemberName: '',
  iwiMemberURL: '',
  imid: null,
  sequence: Number.MAX_SAFE_INTEGER
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
  const handleUploadCallback = async file => {
    const imageUrl = getImageUrl(iwiMemberImageUrlFormat, iwiMemberKeyFormat, props.match.params.imid, iwiMemberFilenameFormat, file.name);
    return await uploadFileToStorage(file, props.firebase, imageUrl);
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
      iwiChairImageURLFile,
      iwiChairName,
      iwiChairProfile,
      iwiMemberImageURLFile,
      iwiMemberName,
      iwiMemberURL,
      sequence
    } = iwiMember;
    let imid = iwiMember.imid;
    let iwiChairImageURL = iwiMember.iwiChairImageURL;
    let iwiMemberImageURL = iwiMember.iwiMemberImageURL;
    let displayIcon = 'error';
    let displayTitle = 'Save Iwi Member Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!iwiMemberImageURL || !iwiMemberName || !iwiMemberURL) {
        displayMessage = 'The Iwi Member Image, Iwi Member Name, and Iwi Member URL fields are required.';
      } else if (iwiChairImageURLFile && iwiChairImageURLFile.size > maxImageFileSize) {
        const {
          size
        } = iwiChairImageURLFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
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
          if (iwiChairImageURLFile && iwiChairImageURLFile.name) {
            iwiChairImageURL = getImageUrl(iwiMemberImageUrlFormat, iwiMemberKeyFormat, imid, iwiMemberFilenameFormat, iwiChairImageURLFile.name, '');
          }
          if (iwiMemberImageURLFile && iwiMemberImageURLFile.name) {
            iwiMemberImageURL = getImageUrl(iwiMemberImageUrlFormat, iwiMemberKeyFormat, imid, iwiMemberFilenameFormat, iwiChairImageURLFile.name, '');
          }
        }
        await firebase.saveDbIwiMember({
          active: active,
          created: now.toString(),
          createdBy: uid,
          iwiChairImageURL,
          iwiChairName,
          iwiChairProfile,
          iwiMemberImageURL,
          iwiMemberName,
          iwiMemberURL,
          imid: imid,
          sequence: sequence,
          updated: now.toString(),
          updatedBy: uid
        });
        if (iwiChairImageURLFile) {
          await firebase.saveStorageFile(iwiChairImageURL, iwiChairImageURLFile);
        }
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
  const handleIwiMemberImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const iwiMemberImageURLFile = e.target.files[0];
      setIwiMember(im => ({
        ...im,
        iwiMemberImageURLFile: iwiMemberImageURLFile
      }));
    }
  };
  const handleIwiChairImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const iwiChairImageURLFile = e.target.files[0];
      setIwiMember(im => ({
        ...im,
        iwiChairImageURLFile: iwiChairImageURLFile
      }));
    }
  };
  useEffect(() => {
    const retrieveIwiMember = async () => {
      const dbIwiMember = await props.firebase.getDbIwiMemberValue(props.match.params.imid);
      const {
        active,
        iwiChairImageURL,
        iwiChairName,
        iwiChairProfile,
        iwiMemberImageURL,
        iwiMemberName,
        iwiMemberURL,
        imid,
        sequence
      } = dbIwiMember;
      setIwiMember(im => ({
        ...im,
        active,
        iwiChairImageURL,
        iwiChairName,
        iwiChairProfile,
        iwiMemberImageURL,
        iwiMemberName,
        iwiMemberURL,
        imid,
        sequence
      }));
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
            ? <LoadingOverlayModal />
            : <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={8}>
                  {
                    isSubmitting
                      ? <LoadingOverlayModal text="Saving..." />
                      : null
                  }
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>Iwi Member Name</Label>
                        <Input placeholder="Iwi Member Name" name="iwiMemberName" value={iwiMember.iwiMemberName} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Iwi Chair Name</Label>
                        <Input placeholder="Iwi Chair Name" name="iwiChairName" value={iwiMember.iwiChairName || ''} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Iwi Chair Profile</Label>
                        <DraftEditor
                          content={iwiMember.content}
                          onChange={handleChange}
                          uploadCallback={handleUploadCallback}
                        />
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
                        <Label>Iwi Member URL</Label>
                        <Input placeholder="Iwi Member URL" name="iwiMemberURL" value={iwiMember.iwiMemberURL} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Sequence</Label>
                        <Input placeholder="Sequence" name="sequence" value={iwiMember.sequence} onChange={handleChange} type="number" min="1" step="1" max={Number.MAX_SAFE_INTEGER} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Iwi Member Image</Label>
                        <FirebaseInput
                          value={iwiMember.iwiMemberImageURL}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'iwiMemberImageURL',
                            name: 'iwiMemberImageURL',
                            placeholder: 'Iwi Member Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleIwiMemberImageUrlFileChange}
                          downloadURLFormat={iwiMemberImageUrlFormat}
                          downloadURLFormatKeyName={iwiMemberKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.imid}
                          downloadURLFormatFileName={iwiMemberFilenameFormat}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Iwi Chair Image</Label>
                        <FirebaseInput
                          value={iwiMember.iwiChairImageURL || ''}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'iwiChairImageURL',
                            name: 'iwiChairImageURL',
                            placeholder: 'Iwi Chair Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleIwiChairImageUrlFileChange}
                          downloadURLFormat={iwiChairImageUrlFormat}
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
