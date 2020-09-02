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
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import {
  Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const eventsRef = '/images/events';
const eventKeyFormat = '{evid}';
const eventFilenameFormat = '{filename}';
const eventImageFolderUrlFormat = `${eventsRef}/${eventKeyFormat}/`;
const eventImageUrlFormat = `${eventImageFolderUrlFormat}${eventFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  content: '',
  externalUrl: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  evid: null,
  editorState: EditorState.createEmpty()
};
const AuthEventView = props => {
  const isNew = props.match.params.evid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setEvent(p => ({
      ...p,
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
      content,
      externalUrl,
      header,
      imageUrlFile
    } = event;
    let evid = event.evid;
    let imageUrl = event.imageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Event Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!imageUrl || !header || (!externalUrl && !content)) {
        displayMessage = 'The Image, Header and External URL/Content fields are required.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        // eslint-disable-next-line
      } else if (externalUrl && !externalUrl.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        displayMessage = 'External URL is invalid.';
      } else {
        if (isNew) {
          evid = await firebase.saveDbEvent({});
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = eventImageUrlFormat
              .replace(eventKeyFormat, evid)
              .replace(eventFilenameFormat, imageUrlFile.name);
          }
        }
        await firebase.saveDbEvent({
          active: active,
          created: now.toString(),
          createdBy: uid,
          content: content,
          externalUrl,
          header,
          imageUrl,
          evid: evid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (imageUrlFile) {
          await firebase.saveStorageFile(imageUrl, imageUrlFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
        displayIcon = 'success';
        displayTitle = 'Save Event Successful';
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
          evid
        } = match.params;
        const eventImageFolderUrl = eventImageFolderUrlFormat.replace(eventKeyFormat, evid);
        const storageFiles = await firebase.getStorageFiles(eventImageFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbEvent(evid);
        swal.fire({
          icon: 'success',
          title: 'Delete Event Successful',
          text: 'Your Event has been deleted.'
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
        title: 'Delete Event Error',
        html: displayMessage
      });
      console.log(`Delete Event Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/Wananga');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setEvent(p => ({
        ...p,
        imageUrlFile: imageUrlFile
      }));
    }
  };
  const handlePreviewClick = async e => {
    e.preventDefault();
    const {
      REACT_APP_WEB_BASE_URL
    } = process.env;
    window.open(`${REACT_APP_WEB_BASE_URL}/Wananga/${event.evid}`, '_blank');
  };
  useEffect(() => {
    const retrieveEvent = async () => {
      const dbEvent = await props.firebase.getDbEventValue(props.match.params.evid);
      const {
        active,
        content,
        externalUrl,
        header,
        imageUrl,
        evid
      } = dbEvent;
      setEvent(p => ({
        ...p,
        active,
        content,
        externalUrl,
        header,
        imageUrl,
        evid,
        editorState: content && content.startsWith('{') && content.endsWith('}')
          ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
          : p.editorState
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveEvent();
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
                <Col xs={12} sm={8}>
                  <Card>
                    {
                      isSubmitting
                        ? <LoadingOverlayModal text="Saving..." />
                        : null
                    }
                    <CardBody>
                      <FormGroup>
                        <Label>External URL</Label>
                        <Input placeholder="External URL" name="externalUrl" value={event.externalUrl} onChange={handleChange} type="url" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <Editor
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                          editorState={event.editorState}
                          onEditorStateChange={editorState => setEvent(p => ({
                            ...p,
                            content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                            editorState: editorState
                          }))}
                        />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={event.active} onChange={handleChange} type="switch" id="EventActive" />
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
                        <Label>Header</Label>
                        <Input placeholder="Header" name="header" value={event.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={event.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={eventImageUrlFormat}
                          downloadURLFormatKeyName={eventKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.evid}
                          downloadURLFormatFileName={eventFilenameFormat}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Button type="button" color="success" size="lg" className="btn-round px-0" block onClick={handlePreviewClick} disabled={isNew || isSubmitting}>Preview <i className="fas fa-external-link-alt" /></Button>
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

export default withAuthorization(condition)(AuthEventView);
