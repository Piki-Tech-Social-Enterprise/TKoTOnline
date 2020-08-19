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

const projectsRef = '/images/projects';
const projectKeyFormat = '{pid}';
const projectFilenameFormat = '{filename}';
const projectImageFolderUrlFormat = `${projectsRef}/${projectKeyFormat}/`;
const projectImageUrlFormat = `${projectImageFolderUrlFormat}${projectFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  content: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  pid: null,
  editorState: EditorState.createEmpty()
};
const AuthProjectView = props => {
  const isNew = props.match.params.pid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setProject(p => ({
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
      header,
      imageUrlFile
    } = project;
    let pid = project.pid;
    let imageUrl = project.imageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Project Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!imageUrl || !header || !content) {
        displayMessage = 'The Image, Header and Content fields are required.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else {
        if (isNew) {
          pid = await firebase.saveDbProject({});
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = projectImageUrlFormat
              .replace(projectKeyFormat, pid)
              .replace(projectFilenameFormat, imageUrlFile.name);
          }
        }
        await firebase.saveDbProject({
          active: active,
          created: now.toString(),
          createdBy: uid,
          content: content,
          header,
          imageUrl,
          pid: pid,
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
        displayTitle = 'Save Project Successful';
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
          pid
        } = match.params;
        const projectImageFolderUrl = projectImageFolderUrlFormat.replace(projectKeyFormat, pid);
        const storageFiles = await firebase.getStorageFiles(projectImageFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbProject(pid);
        swal.fire({
          icon: 'success',
          title: 'Delete Project Successful',
          text: 'Your Project has been deleted.'
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
        title: 'Delete Project Error',
        html: displayMessage
      });
      console.log(`Delete Project Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/Projects');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setProject(p => ({
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
    window.open(`${REACT_APP_WEB_BASE_URL}/Projects/${project.pid}`, '_blank');
  };
  useEffect(() => {
    const retrieveProject = async () => {
      const dbProject = await props.firebase.getDbProjectValue(props.match.params.pid);
      const {
        active,
        content,
        header,
        imageUrl,
        pid
      } = dbProject;
      setProject(p => ({
        ...p,
        active,
        content,
        header,
        imageUrl,
        pid,
        editorState: content && content.startsWith('{') && content.endsWith('}')
          ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
          : p.editorState
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveProject();
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
                    <CardBody>
                      <FormGroup>
                        <Label>Content</Label>
                        <Editor
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                          editorState={project.editorState}
                          onEditorStateChange={editorState => setProject(p => ({
                            ...p,
                            content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                            editorState: editorState
                          }))}
                        />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={project.active} onChange={handleChange} type="switch" id="ProjectActive" />
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
                        <Input placeholder="Header" name="header" value={project.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={project.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={projectImageUrlFormat}
                          downloadURLFormatKeyName={projectKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.pid}
                          downloadURLFormatFileName={projectFilenameFormat}
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

export default withAuthorization(condition)(AuthProjectView);
