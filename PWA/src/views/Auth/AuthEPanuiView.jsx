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
  DATE_MOMENT_FORMAT,
  TAG_SEPARATOR,
  getImageUrl,
  uploadFileToStorage
} from 'components/App/Utilities';
import DraftEditor from 'components/DraftEditor';
import InputDateTime from 'components/App/InputDateTime';
import TagsInput from 'react-tagsinput-2';
import 'react-tagsinput-2/react-tagsinput.css';

const ePanuiListRef = '/images/ePanuiList';
const ePanuiKeyFormat = '{eid}';
const ePanuiFilenameFormat = '{filename}';
const ePanuiImageFolderUrlFormat = `${ePanuiListRef}/${ePanuiKeyFormat}/`;
const ePanuiImageUrlFormat = `${ePanuiImageFolderUrlFormat}${ePanuiFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  category: '',
  categoryTags: [
    'E-Pānui'
  ],
  content: '',
  date: '',
  imageUrl: '',
  imageUrlFile: null,
  isFeatured: false,
  name: '',
  url: '',
  eid: null
};
const AuthEPanuiView = props => {
  const isNew = props.match.params.eid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [ePanui, setEPanui] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active', 'isFeatured'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setEPanui(u => ({
      ...u,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleUploadCallback = async file => {
    const imageUrl = getImageUrl(ePanuiImageUrlFormat, ePanuiKeyFormat, props.match.params.eid, ePanuiFilenameFormat, file.name);
    return await uploadFileToStorage(file, props.firebase, imageUrl);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const maxImageFileSize = 2097152;
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
      categoryTags,
      content,
      date,
      imageUrlFile,
      isFeatured,
      name,
      url
    } = ePanui;
    let eid = ePanui.eid;
    let imageUrl = ePanui.imageUrl;
    let displayIcon = 'success';
    let displayTitle = `Update E-Pānui Successful`;
    let displayMessage = defaultDisplayMesssage;
    try {
      if (!url || !name || !date || !imageUrl || !content) {
        displayMessage = 'Date, Name, Image, and URL/Content are required fields.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        // eslint-disable-next-line
      } else if (!url.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        displayMessage = 'URL is invalid.';
      }
      if (displayMessage === defaultDisplayMesssage) {
        if (isNew) {
          eid = await firebase.saveDbEPanui({
            active,
            created: now.toString(),
            createdBy: uid,
            category: categoryTags.join(TAG_SEPARATOR),
            content: content,
            date,
            isFeatured,
            name,
            url,
            updated: now.toString(),
            updatedBy: uid
          });
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = getImageUrl(ePanuiImageUrlFormat, ePanuiKeyFormat, eid, ePanuiFilenameFormat, imageUrlFile.name, '');
          }
        }
        await firebase.saveDbEPanui({
          active,
          category: categoryTags.join(TAG_SEPARATOR),
          content: content,
          date,
          imageUrl,
          isFeatured,
          name,
          url,
          updated: now.toString(),
          updatedBy: uid,
          eid: eid
        });
        if (imageUrlFile) {
          await firebase.saveStorageFile(imageUrl, imageUrlFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
      } else {
        displayIcon = 'error';
        displayTitle = `Update E-Pānui Failed`;
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = `Update E-Pānui Failed`;
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
          eid
        } = match.params;
        await firebase.deleteDbEPanui(eid);
        swal.fire({
          icon: 'success',
          title: `Delete E-Pānui Successful`,
          text: `Your E-Pānui has been deleted.`
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
        title: `Delete E-Pānui Error`,
        html: displayMessage
      });
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/EPanui');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setEPanui(ep => ({
        ...ep,
        imageUrlFile: imageUrlFile
      }));
    }
  };
  useEffect(() => {
    const {
      firebase,
      match
    } = props;
    const retrieveEPanui = async () => {
      const dbEPanui = await firebase.getDbEPanuiValue(match.params.eid);
      const {
        active,
        category,
        content,
        date,
        imageUrl,
        isFeatured,
        name,
        url,
        eid
      } = dbEPanui;
      setEPanui(ep => ({
        ...ep,
        active,
        category,
        categoryTags: category && category.length
          ? category.split(TAG_SEPARATOR)
          : ep.categoryTags,
        content,
        date,
        imageUrl,
        isFeatured: isFeatured || false,
        name,
        url,
        eid
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveEPanui();
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
            ? <LoadingOverlayModal />
            : <>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} sm={6}>
                    {
                      isSubmitting
                        ? <LoadingOverlayModal text="Saving..." />
                        : null
                    }
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>Date</Label>
                          <InputDateTime
                            dateFormat={DATE_MOMENT_FORMAT}
                            inputProps={{
                              name: 'date',
                              placeholder: 'Date'
                            }}
                            value={ePanui.date}
                            onChange={value =>
                              handleChange({
                                target: {
                                  name: 'date',
                                  value: value.format(DATE_MOMENT_FORMAT)
                                }
                              })}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Name</Label>
                          <Input placeholder="Name" name="name" value={ePanui.name} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>URL</Label>
                          <Input placeholder="URL" name="url" value={ePanui.url} onChange={handleChange} type="url" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Category</Label>
                          <TagsInput
                            value={ePanui.categoryTags}
                            onChange={tags => handleChange({
                              target: {
                                name: 'categoryTags',
                                value: tags
                              }
                            })}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Image</Label>
                          <FirebaseInput
                            value={ePanui.imageUrl || ''}
                            onChange={handleChange}
                            downloadURLInputProps={{
                              id: 'imageUrl',
                              name: 'imageUrl',
                              placeholder: 'Image',
                              type: 'text'
                            }}
                            downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                            downloadURLFileInputOnChange={handleImageUrlFileChange}
                            downloadURLFormat={ePanuiImageUrlFormat}
                            downloadURLFormatKeyName={ePanuiKeyFormat}
                            downloadURLFormatKeyValue={props.match.params.eid}
                            downloadURLFormatFileName={ePanuiFilenameFormat}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Content</Label>
                          <DraftEditor
                            content={ePanui.content}
                            onChange={handleChange}
                            uploadCallback={handleUploadCallback}
                          />
                        </FormGroup>
                        <FormGroup>
                          <CustomInput label="Is Featured" name="isFeatured" checked={ePanui.isFeatured || false} onChange={handleChange} type="switch" id="EPanuiIsFeatured" />
                        </FormGroup>
                        <FormGroup>
                          <CustomInput label="Active" name="active" checked={ePanui.active} onChange={handleChange} type="switch" id="EPanuiActive" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                          <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label><a href={ePanui.url} target="_blank" rel="noopener noreferrer" className="text-muted">Preview (in another tab/window) <i className="fas fa-external-link-alt" /></a></Label>
                          <iframe
                            title={ePanui.name}
                            src={ePanui.url}
                            style={{
                              height: '19.5rem',
                              width: '100%'
                            }}
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

export default withAuthorization(condition)(AuthEPanuiView);
