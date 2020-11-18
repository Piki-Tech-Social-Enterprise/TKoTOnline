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

const economicDevelopmentsRef = '/economicDevelopments';
const economicDevelopmentKeyFormat = '{edid}';
const economicDevelopmentFilenameFormat = '{filename}';
const economicDevelopmentEconomicDevelopmentFolderUrlFormat = `${economicDevelopmentsRef}/${economicDevelopmentKeyFormat}/`;
const economicDevelopmentEconomicDevelopmentUrlFormat = `${economicDevelopmentEconomicDevelopmentFolderUrlFormat}${economicDevelopmentFilenameFormat}`;
const economicDevelopmentImagesRef = '/images/economicDevelopments';
const economicDevelopmentImageKeyFormat = '{edid}';
const economicDevelopmentImageFilenameFormat = '{filename}';
const economicDevelopmentImageFolderUrlFormat = `${economicDevelopmentImagesRef}/${economicDevelopmentImageKeyFormat}/`;
const economicDevelopmentImageUrlFormat = `${economicDevelopmentImageFolderUrlFormat}${economicDevelopmentImageFilenameFormat}`;
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
  economicDevelopmentUrl: '',
  economicDevelopmentUrlFile: null,
  edid: null
};
const AuthEconomicDevelopmentView = props => {
  const isNew = props.match.params.edid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [economicDevelopment, setEconomicDevelopment] = useState(INITIAL_STATE);
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
    setEconomicDevelopment(r => ({
      ...r,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleUploadCallback = async file => {
    const imageUrl = getImageUrl(economicDevelopmentImageUrlFormat, economicDevelopmentKeyFormat, props.match.params.edid, economicDevelopmentFilenameFormat, file.name);
    return await uploadFileToStorage(file, props.firebase, imageUrl);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const maxImageFileSize = 2097152;
    const maxEconomicDevelopmentFileSize = 2097152;
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
      economicDevelopmentUrlFile
    } = economicDevelopment;
    let edid = economicDevelopment.edid;
    let imageUrl = economicDevelopment.imageUrl;
    let economicDevelopmentUrl = economicDevelopment.economicDevelopmentUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Economic Development Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!economicDevelopmentUrl || !header || !content) {
        displayMessage = 'The Economic Development URL, Header and Content fields are required.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        // eslint-disable-next-line
      } else if (economicDevelopmentUrlFile && economicDevelopmentUrlFile.size > maxEconomicDevelopmentFileSize) {
        const {
          size
        } = economicDevelopmentUrlFile;
        throw new Error(`Economic Developments greater than ${formatBytes(maxEconomicDevelopmentFileSize)} (${formatInteger(maxEconomicDevelopmentFileSize)} bytes) cannot be uploaded.<br /><br />Actual Economic Development size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else {
        if (isNew) {
          edid = await firebase.saveDbEconomicDevelopment({
            created: now.toString(),
            createdBy: uid,
          });
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = getImageUrl(economicDevelopmentImageUrlFormat, economicDevelopmentKeyFormat, edid, economicDevelopmentFilenameFormat, imageUrlFile.name, '');
          }
          if (economicDevelopmentUrlFile && economicDevelopmentUrlFile.name) {
            economicDevelopmentUrl = economicDevelopmentEconomicDevelopmentUrlFormat
              .replace(economicDevelopmentKeyFormat, edid)
              .replace(economicDevelopmentFilenameFormat, economicDevelopmentUrlFile.name);
          }
        }
        await firebase.saveDbEconomicDevelopment({
          active: active,
          category: categoryTags.join(TAG_SEPARATOR),
          content: content,
          header,
          imageUrl,
          isFeatured,
          economicDevelopmentUrl,
          edid: edid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (imageUrlFile) {
          await firebase.saveStorageFile(imageUrl, imageUrlFile);
        }
        if (economicDevelopmentUrlFile) {
          await firebase.saveStorageFile(economicDevelopmentUrl, economicDevelopmentUrlFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
        displayIcon = 'success';
        displayTitle = 'Save Economic Development Successful';
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
          edid
        } = match.params;
        const economicDevelopmentEconomicDevelopmentFolderUrl = economicDevelopmentEconomicDevelopmentFolderUrlFormat.replace(economicDevelopmentKeyFormat, edid);
        const storageFiles = await firebase.getStorageFiles(economicDevelopmentEconomicDevelopmentFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbEconomicDevelopment(edid);
        swal.fire({
          icon: 'success',
          title: 'Delete Economic Development Successful',
          text: 'Your Economic Development has been deleted.'
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
        title: 'Delete Economic Development Error',
        html: displayMessage
      });
      console.log(`Delete Economic Development Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/EconomicDevelopments');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setEconomicDevelopment(r => ({
        ...r,
        imageUrlFile: imageUrlFile
      }));
    }
  };
  const handleEconomicDevelopmentUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const economicDevelopmentUrlFile = e.target.files[0];
      setEconomicDevelopment(r => ({
        ...r,
        economicDevelopmentUrlFile: economicDevelopmentUrlFile
      }));
    }
  };
  useEffect(() => {
    const retrieveEconomicDevelopment = async () => {
      const {
        firebase,
        match
      } = props;
      const dbEconomicDevelopment = await firebase.getDbEconomicDevelopmentValue(match.params.edid);
      const {
        active,
        category,
        content,
        header,
        imageUrl,
        isFeatured,
        economicDevelopmentUrl,
        edid
      } = dbEconomicDevelopment;
      const economicDevelopmentDownloadUrl = economicDevelopmentUrl.startsWith('/economicDevelopments')
        ? await firebase.getStorageFileDownloadURL(economicDevelopmentUrl)
        : economicDevelopmentUrl;
      const economicDevelopmentCardUrl = `/EconomicDevelopmentCard?header=${encodeURIComponent(header)}&imageUrl=${encodeURIComponent(imageUrl)}&content=${encodeURIComponent(content)}&economicDevelopmentUrl=${encodeURIComponent(economicDevelopmentUrl)}&economicDevelopmentDownloadUrl=${encodeURIComponent(economicDevelopmentDownloadUrl)}`;
      setEconomicDevelopment(r => ({
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
        economicDevelopmentUrl,
        economicDevelopmentDownloadUrl,
        edid,
        economicDevelopmentCardUrl
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveEconomicDevelopment();
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
                          value={economicDevelopment.categoryTags}
                          onChange={tags => handleChange({
                            target: {
                              name: 'categoryTags',
                              value: tags
                            }
                          })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label className="d-inline">Economic Development URL&nbsp;
                          {
                            economicDevelopment.economicDevelopmentDownloadUrl
                              ? <>
                                <a href={economicDevelopment.economicDevelopmentDownloadUrl} target="_blank" rel="noopener noreferrer" className="small text-muted text-decoration-none float-right">
                                  Preview (in another tab/window) <i className="fas fa-external-link-alt" />
                                </a>
                              </>
                              : null
                          }
                        </Label>
                        <FirebaseInput
                          value={economicDevelopment.economicDevelopmentUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'economicDevelopmentUrl',
                            name: 'economicDevelopmentUrl',
                            placeholder: 'Economic Development URL',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleEconomicDevelopmentUrlFileChange}
                          downloadURLFormat={economicDevelopmentEconomicDevelopmentUrlFormat}
                          downloadURLFormatKeyName={economicDevelopmentKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.edid}
                          downloadURLFormatFileName={economicDevelopmentFilenameFormat}
                          downloadURLFileInputAcceptProp="*/*"
                          showImagePreview={false}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Header</Label>
                        <Input placeholder="Header" name="header" value={economicDevelopment.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={economicDevelopment.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={economicDevelopmentImageUrlFormat}
                          downloadURLFormatKeyName={economicDevelopmentKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.edid}
                          downloadURLFormatFileName={economicDevelopmentFilenameFormat}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <DraftEditor
                          content={economicDevelopment.content}
                          onChange={handleChange}
                          uploadCallback={handleUploadCallback}
                        />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Is Featured" name="isFeatured" checked={economicDevelopment.isFeatured || false} onChange={handleChange} type="switch" id="EconomicDevelopmentIsFeatured" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={economicDevelopment.active} onChange={handleChange} type="switch" id="EconomicDevelopmentActive" />
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
                          title={economicDevelopment.header}
                          src={`${REACT_APP_WEB_BASE_URL}${economicDevelopment.economicDevelopmentCardUrl}`}
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

export default withAuthorization(condition)(AuthEconomicDevelopmentView);
