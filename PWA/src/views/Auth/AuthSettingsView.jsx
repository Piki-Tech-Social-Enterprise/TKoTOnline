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
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CustomInput
} from 'reactstrap';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import swal from 'sweetalert2';
import DraftEditor from 'components/DraftEditor';
import {
  formatBytes,
  formatInteger,
  getImageUrl,
  uploadFileToStorage
} from 'components/App/Utilities';
import FirebaseInput from 'components/Firebase/FirebaseInput';

const settingsRef = '/images/settings';
const settingKeyFormat = '{sid}';
const settingFilenameFormat = '{filename}';
const settingImageFolderUrlFormat = `${settingsRef}/${settingKeyFormat}/`;
const settingHomePageHeaderImageUrlFormat = `${settingImageFolderUrlFormat}${settingFilenameFormat}`;
const INITIAL_STATE = {
  homePageHeaderImageUrl: '',
  homePageHeaderImageUrlFile: null,
  homePageAboutImageUrl: '',
  homePageAboutImageUrlFile: null,
  homePageAboutDescription: '',
  homePageVideoSourceUrl: '',
  aboutPageDescription: '',
  aboutPageTKoTBackOfficeStructureDescription: '',
  sid: null,
  aboutPageTKoTBackOfficeStructureImageUrl: '',
  aboutPageTKoTBackOfficeStructureImageUrlFile: null,
  aboutPageExtraDescription: '',
  newsSectionDescription: '',
  gmailEmail: '',
  gmailPassword: ''
};
const AuthSettingsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [overwriteExisting, setOverwriteExisting] = useState(true);
  const [deleteOnly, setDeleteOnly] = useState(false);
  const [isResizingImages, setIsResizingImages] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = async e => {
    e.preventDefault();
    setActiveTab(Number(e.currentTarget.dataset['tab']));
  };
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
  const handleUploadCallback = async file => {
    const dbSettings = await props.firebase.getDbSettingsValues(true);
    const imageUrl = getImageUrl(settingHomePageHeaderImageUrlFormat, settingKeyFormat, dbSettings.sid, settingFilenameFormat, file.name);
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
      homePageHeaderImageUrlFile,
      homePageAboutImageUrlFile,
      homePageAboutDescription,
      homePageVideoSourceUrl,
      aboutPageDescription,
      aboutPageTKoTBackOfficeStructureDescription,
      aboutPageTKoTBackOfficeStructureImageUrlFile,
      aboutPageExtraDescription,
      newsSectionDescription,
      gmailEmail,
      gmailPassword
    } = settings;
    let sid = settings.sid;
    let homePageHeaderImageUrl = settings.homePageHeaderImageUrl;
    let homePageAboutImageUrl = settings.homePageAboutImageUrl;
    let aboutPageTKoTBackOfficeStructureImageUrl = settings.aboutPageTKoTBackOfficeStructureImageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Updating Settings Failed';
    let displayMessage = '';
    try {
      if (!homePageHeaderImageUrl || !homePageAboutImageUrl || !homePageAboutDescription || !aboutPageDescription || !aboutPageTKoTBackOfficeStructureDescription) {
        displayMessage = 'The Home Page Header Image, Home Page About Image, Home Page About Description, About Page Description, and About Page TKoT Back Office Structure Description fields are required.';
      } else if (homePageHeaderImageUrlFile && homePageHeaderImageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = homePageHeaderImageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else if (homePageAboutImageUrlFile && homePageAboutImageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = homePageAboutImageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
        // eslint-disable-next-line
      } else if (homePageVideoSourceUrl && !homePageVideoSourceUrl.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        displayMessage = 'Home Page Video Source URL is invalid.';
      } else if (aboutPageTKoTBackOfficeStructureImageUrlFile && aboutPageTKoTBackOfficeStructureImageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = aboutPageTKoTBackOfficeStructureImageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else if (gmailEmail && !gmailEmail.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        displayMessage = 'GMail Email is invalid.';
      } else if (gmailEmail && !gmailPassword) {
        displayMessage = 'When GMail Email is defined, GMail Password field is required.';
      } else {
        if (homePageHeaderImageUrlFile && homePageHeaderImageUrlFile.name) {
          homePageHeaderImageUrl = getImageUrl(settingHomePageHeaderImageUrlFormat, settingKeyFormat, sid, settingFilenameFormat, homePageHeaderImageUrlFile.name, '');
        }
        if (homePageAboutImageUrlFile && homePageAboutImageUrlFile.name) {
          homePageAboutImageUrl = getImageUrl(settingHomePageHeaderImageUrlFormat, settingKeyFormat, sid, settingFilenameFormat, homePageAboutImageUrlFile.name, '');
        }
        if (aboutPageTKoTBackOfficeStructureImageUrlFile && aboutPageTKoTBackOfficeStructureImageUrlFile.name) {
          aboutPageTKoTBackOfficeStructureImageUrl = getImageUrl(settingHomePageHeaderImageUrlFormat, settingKeyFormat, sid, settingFilenameFormat, aboutPageTKoTBackOfficeStructureImageUrlFile.name, '');
        }
        await firebase.saveDbSettings({
          created: now.toString(),
          createdBy: uid,
          homePageHeaderImageUrl: homePageHeaderImageUrl,
          homePageAboutImageUrl: homePageAboutImageUrl,
          homePageAboutDescription: homePageAboutDescription,
          homePageVideoSourceUrl: homePageVideoSourceUrl,
          aboutPageDescription: aboutPageDescription,
          aboutPageTKoTBackOfficeStructureDescription: aboutPageTKoTBackOfficeStructureDescription,
          aboutPageTKoTBackOfficeStructureImageUrl: aboutPageTKoTBackOfficeStructureImageUrl,
          aboutPageExtraDescription: aboutPageExtraDescription,
          newsSectionDescription: newsSectionDescription,
          gmailEmail: gmailEmail,
          gmailPassword: gmailPassword,
          sid: sid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (homePageHeaderImageUrlFile) {
          await firebase.saveStorageFile(homePageHeaderImageUrl, homePageHeaderImageUrlFile);
        }
        if (homePageAboutImageUrlFile) {
          await firebase.saveStorageFile(homePageAboutImageUrl, homePageAboutImageUrlFile);
        }
        if (aboutPageTKoTBackOfficeStructureImageUrlFile) {
          await firebase.saveStorageFile(aboutPageTKoTBackOfficeStructureImageUrl, aboutPageTKoTBackOfficeStructureImageUrlFile);
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
  const handleHomePageAboutImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const homePageAboutImageUrlFile = e.target.files[0];
      setSettings(s => ({
        ...s,
        homePageAboutImageUrlFile: homePageAboutImageUrlFile
      }));
    }
  };
  const handleAboutPageTKoTBackOfficeStructureImageUrlChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const aboutPageTKoTBackOfficeStructureImageUrlFile = e.target.files[0];
      setSettings(s => ({
        ...s,
        aboutPageTKoTBackOfficeStructureImageUrlFile: aboutPageTKoTBackOfficeStructureImageUrlFile
      }));
    }
  };
  const handleSendTestEmailClick = async e => {
    e.preventDefault();
    let displayIcon = 'error';
    let displayTitle = 'Send Test Email Failed';
    let displayMessage = '';
    try {
      setIsSendingTestEmail(true);
      const {
        gmailEmail,
        gmailPassword
      } = settings;
      if (gmailEmail && gmailPassword) {
        const {
          REACT_APP_PWA_EMAIL
        } = process.env;
        const {
          firebase
        } = props;
        const functionsRepositoryOptions = {
          functionName: 'sendEmail',
          data: {
            mailOptions: {
              from: gmailEmail,
              to: REACT_APP_PWA_EMAIL,
              subject: 'Test Email',
              text: 'Test Message'
            },
            authUser: gmailEmail,
            authPass: gmailPassword
          }
        };
        const result = await firebase.call(functionsRepositoryOptions);
        console.log(`${functionsRepositoryOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
        displayIcon = 'success';
        displayTitle = 'Send Test Email Successful';
        displayMessage = `A test email was sent to '${REACT_APP_PWA_EMAIL}'.`;
        return result.data;
      } else {
        displayMessage = 'GMail Email and Password are required fields.';
      }
    } catch (error) {
      console.log('handleSendTestEmailClick.error: ', error);
      displayMessage = error;
    } finally {
      setIsSendingTestEmail(false);
      if (displayMessage) {
        swal.fire({
          icon: displayIcon,
          title: displayTitle,
          html: displayMessage
        });
      }
    }
  };
  const handleResizeImagesClick = async e => {
    e.preventDefault();
    let displayIcon = 'error';
    let displayTitle = 'Resize Images Failed';
    let displayMessage = '';
    try {
      setIsResizingImages(true);
      const {
        firebase
      } = props;
      const functionsRepositoryOptions = {
        functionName: 'resizeImages',
        data: {
          overwriteExisting: overwriteExisting,
          deleteOnly: deleteOnly
        }
      };
      const result = firebase.call(functionsRepositoryOptions);
      console.log(`${functionsRepositoryOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
      displayIcon = 'success';
      displayTitle = 'Resize Images Successful';
      displayMessage = `Resizing images have finished.`;
      // return result.data;
    } catch (error) {
      console.log('handleResizeImagesClick.error: ', error);
      displayMessage = error;
    } finally {
      setIsResizingImages(false);
      if (displayMessage) {
        swal.fire({
          icon: displayIcon,
          title: displayTitle,
          html: displayMessage
        });
      }
    }
  };
  useEffect(() => {
    const retrieveSettings = async () => {
      const dbSettings = await props.firebase.getDbSettingsValues(true);
      if (dbSettings) {
        const {
          homePageHeaderImageUrl,
          homePageAboutImageUrl,
          homePageAboutDescription,
          homePageVideoSourceUrl,
          aboutPageDescription,
          aboutPageTKoTBackOfficeStructureDescription,
          aboutPageTKoTBackOfficeStructureImageUrl,
          aboutPageExtraDescription,
          newsSectionDescription,
          gmailEmail,
          gmailPassword,
          sid
        } = dbSettings;
        setSettings(s => ({
          ...s,
          homePageHeaderImageUrl,
          homePageAboutImageUrl,
          homePageAboutDescription,
          homePageVideoSourceUrl,
          aboutPageDescription,
          aboutPageTKoTBackOfficeStructureDescription,
          aboutPageTKoTBackOfficeStructureImageUrl,
          aboutPageExtraDescription,
          newsSectionDescription,
          gmailEmail,
          gmailPassword,
          sid
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
            {
              isSubmitting
                ? <LoadingOverlayModal text="Saving..." />
                : null
            }
            <Card>
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            data-tab={1}
                            active={activeTab === 1}
                            onClick={handleTabClick}
                            className="clickable"
                          >Home Page</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            data-tab={2}
                            active={activeTab === 2}
                            onClick={handleTabClick}
                            className="clickable"
                          >About Page</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            data-tab={3}
                            active={activeTab === 3}
                            onClick={handleTabClick}
                            className="clickable"
                          >News Section</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            data-tab={4}
                            active={activeTab === 4}
                            onClick={handleTabClick}
                            className="clickable"
                          >3rd Party Integrations</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            data-tab={5}
                            active={activeTab === 5}
                            onClick={handleTabClick}
                            className="clickable"
                          >Misc.</NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent
                        activeTab={activeTab}
                      >
                        <TabPane tabId={1}>
                          <FormGroup>
                            <Label>Home Page About Image</Label>
                            <FirebaseInput
                              value={settings.homePageAboutImageUrl || ''}
                              onChange={handleChange}
                              downloadURLInputProps={{
                                id: 'homePageAboutImageUrl',
                                name: 'homePageAboutImageUrl',
                                placeholder: 'Home Page About Image',
                                type: 'text'
                              }}
                              downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                              downloadURLFileInputOnChange={handleHomePageAboutImageUrlFileChange}
                              downloadURLFormat={settingHomePageHeaderImageUrlFormat}
                              downloadURLFormatKeyName={settingKeyFormat}
                              downloadURLFormatKeyValue={settings.sid || ''}
                              downloadURLFormatFileName={settingFilenameFormat}
                              downloadURLResize="md"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label>Home Page About Description</Label>
                            <Input placeholder="Home Page About Description" name="homePageAboutDescription" value={settings.homePageAboutDescription} onChange={handleChange} type="textarea" />
                          </FormGroup>
                          <FormGroup>
                            <Label>Home Page Header Image</Label>
                            <FirebaseInput
                              value={settings.homePageHeaderImageUrl || ''}
                              onChange={handleChange}
                              downloadURLInputProps={{
                                id: 'homePageHeaderImageUrl',
                                name: 'homePageHeaderImageUrl',
                                placeholder: 'Home Page Header Image',
                                type: 'text'
                              }}
                              downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                              downloadURLFileInputOnChange={handleHomePageHeaderImageUrlFileChange}
                              downloadURLFormat={settingHomePageHeaderImageUrlFormat}
                              downloadURLFormatKeyName={settingKeyFormat}
                              downloadURLFormatKeyValue={settings.sid || ''}
                              downloadURLFormatFileName={settingFilenameFormat}
                              downloadURLResize="md"
                            />
                          </FormGroup>
                        </TabPane>
                        <TabPane tabId={2}>
                          <FormGroup>
                            <Label>About Page Video Source URL</Label>
                            <Input placeholder="About Page Video Source URL" name="homePageVideoSourceUrl" value={settings.homePageVideoSourceUrl} onChange={handleChange} type="url" />
                          </FormGroup>
                          <FormGroup>
                            <Label>About Page Description</Label>
                            <DraftEditor
                              content={settings.aboutPageDescription}
                              onChange={handleChange}
                              uploadCallback={handleUploadCallback}
                              contentFieldName="aboutPageDescription"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label>About Page TKoT Back Office Structure Description</Label>
                            <DraftEditor
                              content={settings.aboutPageTKoTBackOfficeStructureDescription}
                              onChange={handleChange}
                              uploadCallback={handleUploadCallback}
                              contentFieldName="aboutPageTKoTBackOfficeStructureDescription"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label>About Page TKoT Back Office Structure Image</Label>
                            <FirebaseInput
                              value={settings.aboutPageTKoTBackOfficeStructureImageUrl || ''}
                              onChange={handleChange}
                              downloadURLInputProps={{
                                id: 'aboutPageTKoTBackOfficeStructureImageUrl',
                                name: 'aboutPageTKoTBackOfficeStructureImageUrl',
                                placeholder: 'About Page TKoT Back Office Structure Image',
                                type: 'text'
                              }}
                              downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                              downloadURLFileInputOnChange={handleAboutPageTKoTBackOfficeStructureImageUrlChange}
                              downloadURLFormat={settingHomePageHeaderImageUrlFormat}
                              downloadURLFormatKeyName={settingKeyFormat}
                              downloadURLFormatKeyValue={settings.sid || ''}
                              downloadURLFormatFileName={settingFilenameFormat}
                              downloadURLResize="md"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label>About Page Extra Description</Label>
                            <DraftEditor
                              content={settings.aboutPageExtraDescription}
                              onChange={handleChange}
                              uploadCallback={handleUploadCallback}
                              contentFieldName="aboutPageExtraDescription"
                            />
                          </FormGroup>
                        </TabPane>
                        <TabPane tabId={3}>
                          <FormGroup>
                            <Label>News Section Description</Label>
                            <DraftEditor
                              content={settings.newsSectionDescription}
                              onChange={handleChange}
                              uploadCallback={handleUploadCallback}
                              contentFieldName="newsSectionDescription"
                            />
                          </FormGroup>
                        </TabPane>
                        <TabPane tabId={4}>
                          <h5 className="mt-3">GMail</h5>
                          <hr />
                          <Row form>
                            <Col xs={12} sm={4}>
                              <FormGroup>
                                <Label>Email</Label>
                                <Input placeholder="Email" name="gmailEmail" value={settings.gmailEmail || ''} onChange={handleChange} type="email" />
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={4}>
                              <FormGroup>
                                <Label>Password</Label>
                                <Input placeholder="Password" name="gmailPassword" value={settings.gmailPassword || ''} onChange={handleChange} type="password" />
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={4}>
                              <Button
                                type="button"
                                color="success"
                                outline
                                className="btn-round mt-0 mt-sm-4"
                                disabled={isSubmitting || isSendingTestEmail}
                                onClick={handleSendTestEmailClick}
                              >Send Test Email</Button>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId={5}>
                          <FormGroup>
                            <CustomInput
                              label="Overwrite Existing"
                              name="overwriteExisting"
                              checked={overwriteExisting}
                              onChange={async () => setOverwriteExisting(!overwriteExisting)}
                              type="switch"
                              id="SettingsOverwriteExisting"
                            />
                          {/* </FormGroup>
                          <FormGroup> */}
                            <CustomInput
                              label="Delete Only"
                              name="deleteOnly"
                              checked={deleteOnly}
                              onChange={async () => setDeleteOnly(!deleteOnly)}
                              type="switch"
                              id="SettingsDeleteOnly"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Button
                              type="button"
                              color="success"
                              size="lg"
                              className="btn-round w-25 px-0 mr-3"
                              disabled={isSubmitting || isResizingImages}
                              onClick={handleResizeImagesClick}
                            >Resize Images</Button>
                          </FormGroup>
                        </TabPane>
                      </TabContent>
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
