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

const resourcesRef = '/resources';
const resourceKeyFormat = '{rid}';
const resourceFilenameFormat = '{filename}';
const resourceResourceFolderUrlFormat = `${resourcesRef}/${resourceKeyFormat}/`;
const resourceResourceUrlFormat = `${resourceResourceFolderUrlFormat}${resourceFilenameFormat}`;
const resourceImagesRef = '/images/resources';
const resourceImageKeyFormat = '{rid}';
const resourceImageFilenameFormat = '{filename}';
const resourceImageFolderUrlFormat = `${resourceImagesRef}/${resourceImageKeyFormat}/`;
const resourceImageUrlFormat = `${resourceImageFolderUrlFormat}${resourceImageFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  content: '',
  header: '',
  resourceUrl: '',
  resourceUrlFile: null,
  rid: null
};
const AuthResourceView = props => {
  const isNew = props.match.params.rid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setResource(p => ({
      ...p,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleUploadCallback = async file => {
    const imageUrl = getImageUrl(resourceImageUrlFormat, resourceKeyFormat, props.match.params.rid, resourceFilenameFormat, file.name);
    return await uploadFileToStorage(file, props.firebase, imageUrl);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const maxResourceFileSize = 2097152;
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
      content,
      header,
      resourceUrlFile
    } = resource;
    let rid = resource.rid;
    let resourceUrl = resource.resourceUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Resource Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!resourceUrl || !header || !content) {
        displayMessage = 'The Resource, Header and Content fields are required.';
      } else if (resourceUrlFile && resourceUrlFile.size > maxResourceFileSize) {
        const {
          size
        } = resourceUrlFile;
        throw new Error(`Resources greater than ${formatBytes(maxResourceFileSize)} (${formatInteger(maxResourceFileSize)} bytes) cannot be uploaded.<br /><br />Actual resource size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else {
        if (isNew) {
          rid = await firebase.saveDbResource({});
          if (resourceUrlFile && resourceUrlFile.name) {
            resourceUrl = resourceResourceUrlFormat
              .replace(resourceKeyFormat, rid)
              .replace(resourceFilenameFormat, resourceUrlFile.name);
          }
        }
        await firebase.saveDbResource({
          active: active,
          created: now.toString(),
          createdBy: uid,
          content: content,
          header,
          resourceUrl,
          rid: rid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (resourceUrlFile) {
          await firebase.saveStorageFile(resourceUrl, resourceUrlFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
        displayIcon = 'success';
        displayTitle = 'Save Resource Successful';
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
          rid
        } = match.params;
        const resourceResourceFolderUrl = resourceResourceFolderUrlFormat.replace(resourceKeyFormat, rid);
        const storageFiles = await firebase.getStorageFiles(resourceResourceFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbResource(rid);
        swal.fire({
          icon: 'success',
          title: 'Delete Resource Successful',
          text: 'Your Resource has been deleted.'
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
        title: 'Delete Resource Error',
        html: displayMessage
      });
      console.log(`Delete Resource Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/Resources');
  };
  const handleResourceUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const resourceUrlFile = e.target.files[0];
      setResource(p => ({
        ...p,
        resourceUrlFile: resourceUrlFile
      }));
    }
  };
  useEffect(() => {
    const retrieveResource = async () => {
      const {
        firebase,
        match
      } = props;
      const dbResource = await firebase.getDbResourceValue(match.params.rid);
      const {
        active,
        content,
        header,
        resourceUrl,
        rid
      } = dbResource;
      const resourceDownloadUrl = resourceUrl.startsWith('/resources')
        ? await firebase.getStorageFileDownloadURL(resourceUrl)
        : resourceUrl;
      setResource(p => ({
        ...p,
        active,
        content,
        header,
        resourceUrl,
        resourceDownloadUrl,
        rid
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveResource();
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
            ? <LoadingOverlayModal color="text-body" />
            : <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  {
                    isSubmitting
                      ? <LoadingOverlayModal text="Saving..." />
                      : null
                  }
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label className="d-inline">Resource&nbsp;
                          {
                            resource.resourceDownloadUrl
                              ? <>
                                <a href={resource.resourceDownloadUrl} target="_blank" rel="noopener noreferrer" className="small text-muted text-decoration-none float-right">
                                  Preview (in another tab/window) <i className="fas fa-external-link-alt" />
                                </a>
                              </>
                              : null
                          }
                        </Label>
                        <FirebaseInput
                          value={resource.resourceUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'resourceUrl',
                            name: 'resourceUrl',
                            placeholder: 'Resource',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleResourceUrlFileChange}
                          downloadURLFormat={resourceResourceUrlFormat}
                          downloadURLFormatKeyName={resourceKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.rid}
                          downloadURLFormatFileName={resourceFilenameFormat}
                          downloadURLFileInputAcceptProp="*/*"
                          showImagePreview={false}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Header</Label>
                        <Input placeholder="Header" name="header" value={resource.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <DraftEditor
                          content={resource.content}
                          onChange={handleChange}
                          uploadCallback={handleUploadCallback}
                        />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={resource.active} onChange={handleChange} type="switch" id="ResourceActive" />
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
        }
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthResourceView);
