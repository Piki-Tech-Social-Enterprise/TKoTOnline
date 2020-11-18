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
  TAG_SEPARATOR,
  getImageUrl,
  uploadFileToStorage
} from 'components/App/Utilities';
import DraftEditor from 'components/DraftEditor';
import TagsInput from 'react-tagsinput-2';
import 'react-tagsinput-2/react-tagsinput.css';

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
  category: '',
  categoryTags: [
    'Uncategorised'
  ],
  content: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  isFeatured: false,
  resourceUrl: '',
  resourceUrlFile: null,
  rid: null
};
const AuthResourceView = props => {
  const isNew = props.match.params.rid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active', 'isFeatured'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setResource(r => ({
      ...r,
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
    const maxImageFileSize = 2097152;
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
      categoryTags,
      content,
      header,
      imageUrlFile,
      isFeatured,
      resourceUrlFile
    } = resource;
    let rid = resource.rid;
    let imageUrl = resource.imageUrl;
    let resourceUrl = resource.resourceUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Resource Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!resourceUrl || !header || !content) {
        displayMessage = 'The Resource, Header and Content fields are required.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        // eslint-disable-next-line
      } else if (resourceUrlFile && resourceUrlFile.size > maxResourceFileSize) {
        const {
          size
        } = resourceUrlFile;
        throw new Error(`Resources greater than ${formatBytes(maxResourceFileSize)} (${formatInteger(maxResourceFileSize)} bytes) cannot be uploaded.<br /><br />Actual resource size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else {
        if (isNew) {
          rid = await firebase.saveDbResource({
            created: now.toString(),
            createdBy: uid,
          });
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = getImageUrl(resourceImageUrlFormat, resourceKeyFormat, rid, resourceFilenameFormat, imageUrlFile.name, '');
          }
          if (resourceUrlFile && resourceUrlFile.name) {
            resourceUrl = resourceResourceUrlFormat
              .replace(resourceKeyFormat, rid)
              .replace(resourceFilenameFormat, resourceUrlFile.name);
          }
        }
        await firebase.saveDbResource({
          active: active,
          category: categoryTags.join(TAG_SEPARATOR),
          content: content,
          header,
          imageUrl,
          isFeatured,
          resourceUrl,
          rid: rid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (imageUrlFile) {
          await firebase.saveStorageFile(imageUrl, imageUrlFile);
        }
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
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setResource(r => ({
        ...r,
        imageUrlFile: imageUrlFile
      }));
    }
  };
  const handleResourceUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const resourceUrlFile = e.target.files[0];
      setResource(r => ({
        ...r,
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
        category,
        content,
        header,
        imageUrl,
        isFeatured,
        resourceUrl,
        rid
      } = dbResource;
      const resourceDownloadUrl = resourceUrl.startsWith('/resources')
        ? await firebase.getStorageFileDownloadURL(resourceUrl)
        : resourceUrl;
      const resourceCardUrl = `/ResourceCard?header=${encodeURIComponent(header)}&imageUrl=${encodeURIComponent(imageUrl)}&content=${encodeURIComponent(content)}&resourceUrl=${encodeURIComponent(resourceUrl)}&resourceDownloadUrl=${encodeURIComponent(resourceDownloadUrl)}`;
      setResource(r => ({
        ...r,
        active,
        category,
        categoryTags: category && category.length
          ? category.split(TAG_SEPARATOR)
          : r.categoryTags,
        content,
        header,
        imageUrl: imageUrl || '',
        isFeatured: isFeatured || false,
        resourceUrl,
        resourceDownloadUrl,
        rid,
        resourceCardUrl
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
  }, [props, isNew, isLoading]);
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        {
          isLoading
            ? <LoadingOverlayModal />
            : <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={7}>
                  {
                    isSubmitting
                      ? <LoadingOverlayModal text="Saving..." />
                      : null
                  }
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>Category</Label>
                        <TagsInput
                          value={resource.categoryTags}
                          onChange={tags => handleChange({
                            target: {
                              name: 'categoryTags',
                              value: tags
                            }
                          })}
                        />
                      </FormGroup>
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
                        <Label>Image</Label>
                        <FirebaseInput
                          value={resource.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={resourceImageUrlFormat}
                          downloadURLFormatKeyName={resourceKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.rid}
                          downloadURLFormatFileName={resourceFilenameFormat}
                        />
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
                        <CustomInput label="Is Featured" name="isFeatured" checked={resource.isFeatured || false} onChange={handleChange} type="switch" id="ResourceIsFeatured" />
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
                <Col xs={12} sm={5}>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label className="text-muted">Website Preview</Label>
                        <iframe
                          title={resource.header}
                          src={`${REACT_APP_WEB_BASE_URL}${resource.resourceCardUrl}`}
                          style={{
                            border: 'none',
                            height: '50rem',
                            width: '100%'
                          }}
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

export default withAuthorization(condition)(AuthResourceView);
