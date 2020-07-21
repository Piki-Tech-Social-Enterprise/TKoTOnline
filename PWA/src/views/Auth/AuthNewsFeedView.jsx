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
  Button,
  InputGroup
} from 'reactstrap';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import swal from 'sweetalert2';
import FirebaseInput from 'components/FirebaseInput';
import {
  formatBytes,
  formatInteger,
  DATE_MOMENT_FORMAT,
  TAG_SEPARATOR
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
import InputDateTime from 'components/App/InputDateTime';
import TagsInput from 'react-tagsinput-2';
import 'react-tagsinput-2/react-tagsinput.css';

const newsFeedsRef = '/images/newsFeeds';
const newsFeedKeyFormat = '{nfid}';
const newsFeedFilenameFormat = '{filename}';
const newsFeedImageFolderUrlFormat = `${newsFeedsRef}/${newsFeedKeyFormat}/`;
const newsFeedImageUrlFormat = `${newsFeedImageFolderUrlFormat}${newsFeedFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  category: '',
  categoryTags: [
    'Uncategorized'
  ],
  content: '',
  date: '',
  externalUrl: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  isFeatured: false,
  nfid: null,
  editorState: EditorState.createEmpty()
};
const AuthNewsFeedView = props => {
  const isNew = props.match.params.nfid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [newsFeed, setNewsFeed] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['isFeatured', 'active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setNewsFeed(nf => ({
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
      categoryTags,
      content,
      date,
      externalUrl,
      header,
      imageUrlFile,
      isFeatured
    } = newsFeed;
    let nfid = newsFeed.nfid;
    let imageUrl = newsFeed.imageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save News Feed Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!imageUrl || !header || !date || (!externalUrl && !content)) {
        displayMessage = 'The Image, Header, Date and External URL/Content fields are required.';
      } else if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
        const {
          size
        } = imageUrlFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else if (externalUrl && !externalUrl.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        displayMessage = 'External URL is invalid.';
      } else {
        if (isNew) {
          nfid = await firebase.saveDbNewsFeed({});
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = newsFeedImageUrlFormat
              .replace(newsFeedKeyFormat, nfid)
              .replace(newsFeedFilenameFormat, imageUrlFile.name);
          }
        }
        await firebase.saveDbNewsFeed({
          active: active,
          created: now.toString(),
          createdBy: uid,
          category: categoryTags.join(TAG_SEPARATOR),
          content: content,
          date,
          externalUrl,
          header,
          imageUrl,
          isFeatured,
          nfid: nfid,
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
        displayTitle = 'Save News Feed Successful';
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
          nfid
        } = match.params;
        const newsFeedImageFolderUrl = newsFeedImageFolderUrlFormat.replace(newsFeedKeyFormat, nfid);
        const storageFiles = await firebase.getStorageFiles(newsFeedImageFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbNewsFeed(nfid);
        swal.fire({
          icon: 'success',
          title: 'Delete News Feed Successful',
          text: 'Your News Feed has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: 'Delete News Feed Error',
        html: displayMessage
      });
      console.log(`Delete News Feed Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/NewsFeeds');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setNewsFeed(nf => ({
        ...nf,
        imageUrlFile: imageUrlFile
      }));
    }
  };
  const handlePreviewClick = async e => {
    e.preventDefault();
    const {
      REACT_APP_WEB_BASE_URL
    } = process.env;
    window.open(`${REACT_APP_WEB_BASE_URL}/NewsFeeds/${newsFeed.nfid}`, '_blank');
  };
  useEffect(() => {
    const retrieveNewsFeed = async () => {
      const dbNewsFeed = await props.firebase.getDbNewsFeedValue(props.match.params.nfid);
      const {
        active,
        category,
        content,
        date,
        externalUrl,
        header,
        imageUrl,
        isFeatured,
        nfid
      } = dbNewsFeed;
      setNewsFeed(nf => ({
        ...nf,
        active,
        category,
        categoryTags: category && category.length
          ? category.split(TAG_SEPARATOR)
          : nf.categoryTags,
        content,
        date,
        externalUrl,
        header,
        imageUrl,
        isFeatured,
        nfid,
        editorState: content && content.startsWith('{') && content.endsWith('}')
          ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
          : nf.editorState
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveNewsFeed();
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
                        <Label>External URL</Label>
                        <InputGroup>
                          <Input placeholder="External URL" name="externalUrl" value={newsFeed.externalUrl} onChange={handleChange} type="url" />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <Editor
                          wrapperClassName="wrapper-class"
                          editorClassName="editor-class"
                          toolbarClassName="toolbar-class"
                          editorState={newsFeed.editorState}
                          onEditorStateChange={editorState => setNewsFeed(nf => ({
                            ...nf,
                            content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                            editorState: editorState
                          }))}
                        />
                      </FormGroup>
                      {/* <FormGroup>
                        <CustomInput label="Is Featured?" bsSize="lg" name="isFeatured" checked={newsFeed.isFeatured} onChange={handleChange} type="switch" id="NewsFeedIsFeatured" />
                      </FormGroup> */}
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={newsFeed.active} onChange={handleChange} type="switch" id="NewsFeedActive" />
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
                        <Input placeholder="Header" name="header" value={newsFeed.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={newsFeed.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={newsFeedImageUrlFormat}
                          downloadURLFormatKeyName={newsFeedKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.nfid}
                          downloadURLFormatFileName={newsFeedFilenameFormat}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Date</Label>
                        <InputDateTime
                          dateFormat={DATE_MOMENT_FORMAT}
                          inputProps={{
                            name: 'date',
                            placeholder: 'Date'
                          }}
                          value={newsFeed.date}
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
                        <Label>Category</Label>
                        <TagsInput
                          value={newsFeed.categoryTags}
                          onChange={tags => handleChange({
                            target: {
                              name: 'categoryTags',
                              value: tags
                            }
                          })}
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

export default withAuthorization(condition)(AuthNewsFeedView);
