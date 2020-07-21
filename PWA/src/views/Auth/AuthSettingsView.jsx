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
  Button
} from 'reactstrap';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import swal from 'sweetalert2';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import {
  Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  formatBytes,
  formatInteger
} from 'components/App/Utilities';
import FirebaseInput from 'components/FirebaseInput';

const settingsRef = '/images/settings';
const settingKeyFormat = '{sid}';
const settingFilenameFormat = '{filename}';
const settingImageFolderUrlFormat = `${settingsRef}/${settingKeyFormat}/`;
const settingHomePageHeaderImageUrlFormat = `${settingImageFolderUrlFormat}${settingFilenameFormat}`;
const INITIAL_STATE = {
  homePageHeaderImageUrl: '',
  homePageHeaderImageUrlFile: null,
  homePageAboutDescription: '',
  aboutPageDescription: '',
  sid: null,
  editorState: EditorState.createEmpty()
};
const AuthSettingsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setSettings(s => ({
      ...s,
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
      homePageHeaderImageUrlFile,
      homePageAboutDescription,
      aboutPageDescription,
      editorState
    } = settings;
    let sid = settings.sid;
    let homePageHeaderImageUrl = settings.homePageHeaderImageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Updating Settings Failed';
    let displayMessage = '';
    try {
      if (!homePageHeaderImageUrl || !homePageAboutDescription || !aboutPageDescription) {
        displayMessage = 'The Home Page Header Image, Home Page About Description and About Page Description fields are required.';
      } else if (homePageHeaderImageUrlFile && homePageHeaderImageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = homePageHeaderImageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else {
        if (homePageHeaderImageUrlFile && homePageHeaderImageUrlFile.name) {
          homePageHeaderImageUrl = settingHomePageHeaderImageUrlFormat
            .replace(settingKeyFormat, sid)
            .replace(settingFilenameFormat, homePageHeaderImageUrlFile.name);
        }
        await firebase.saveDbSettings({
          created: now.toString(),
          createdBy: uid,
          homePageHeaderImageUrl: homePageHeaderImageUrl,
          homePageAboutDescription: homePageAboutDescription,
          aboutPageDescription: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          sid: sid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (homePageHeaderImageUrlFile) {
          await firebase.saveStorageFile(homePageHeaderImageUrl, homePageHeaderImageUrlFile);
        }
        displayIcon = 'success';
        displayTitle = 'Updating Settings Successful';
        displayMessage = 'Changes saved';
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
  const handleHomePageHeaderImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const homePageHeaderImageUrlFile = e.target.files[0];
      setSettings(s => ({
        ...s,
        homePageHeaderImageUrlFile: homePageHeaderImageUrlFile
      }));
    }
  };
  useEffect(() => {
    const retrieveSettings = async () => {
      const dbSettings = await props.firebase.getDbSettingsValues(true);
      if (dbSettings) {
        const {
          homePageHeaderImageUrl,
          homePageAboutDescription,
          aboutPageDescription,
          sid
        } = dbSettings;
        setSettings(s => ({
          ...s,
          homePageHeaderImageUrl,
          homePageAboutDescription,
          aboutPageDescription,
          sid,
          editorState: aboutPageDescription && aboutPageDescription.startsWith('{') && aboutPageDescription.endsWith('}')
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(aboutPageDescription)))
            : s.editorState
        }));
      }
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveSettings();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading]);
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        <Row>
          <Col>
            <Card>
              {/* <h3>Setting</h3> */}
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal color="text-white" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={settings.homePageHeaderImageUrl || ''}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'homePageHeaderImageUrl',
                            name: 'homePageHeaderImageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleHomePageHeaderImageUrlFileChange}
                          downloadURLFormat={settingHomePageHeaderImageUrlFormat}
                          downloadURLFormatKeyName={settingKeyFormat}
                          downloadURLFormatKeyValue={settings.sid}
                          downloadURLFormatFileName={settingFilenameFormat}
                          imageResize="md"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Home Page About Description</Label>
                        <Input placeholder="Home Page About Description" name="homePageAboutDescription" value={settings.homePageAboutDescription} onChange={handleChange} type="textarea" />
                      </FormGroup>
                      <FormGroup>
                        <Label>About Page Description</Label>
                        <Editor
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                          editorState={settings.editorState}
                          onEditorStateChange={editorState => setSettings(s => ({
                            ...s,
                            editorState: editorState
                          }))}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                      </FormGroup>
                    </Form>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthSettingsView);
