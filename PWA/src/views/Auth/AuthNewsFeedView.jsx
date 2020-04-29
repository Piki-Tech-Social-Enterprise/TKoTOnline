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

const newsFeedsRef = '/images/newsFeeds';
const newsFeedKeyFormat = '{nfid}';
const newsFeedFilenameFormat = '{filename}';
const newsFeedImageFolderUrlFormat = `${newsFeedsRef}/${newsFeedKeyFormat}/`;
const newsFeedImageUrlFormat = `${newsFeedImageFolderUrlFormat}${newsFeedFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  caption: '',
  content: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  isFeatured: false,
  nfid: null
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
      caption,
      content,
      header,
      imageUrlFile,
      isFeatured
    } = newsFeed;
    let nfid = newsFeed.nfid;
    let imageUrl = newsFeed.imageUrl;
    let displayType = 'success';
    let displayTitle = 'Update News Feed Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!imageUrl || !header || !caption || !content) {
        displayMessage = 'The Image, Header, Caption, and Content fields are required.';
      } else
        if (imageUrlFile && imageUrlFile.size > maxImageFileSize) {
          const {
            size
          } = imageUrlFile;
          throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
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
            caption,
            content,
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
        }
    } catch (error) {
      displayType = 'error';
      displayTitle = 'Update News Feed Failed';
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        type: displayType,
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
        type: 'warning',
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
          type: 'success',
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
        type: 'error',
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
  useEffect(() => {
    const retrieveNewsFeed = async () => {
      const dbNewsFeed = await props.firebase.getDbNewsFeedValue(props.match.params.nfid);
      const {
        active,
        caption,
        content,
        header,
        imageUrl,
        isFeatured,
        nfid
      } = dbNewsFeed;
      setNewsFeed({
        active,
        caption,
        content,
        header,
        imageUrl,
        isFeatured,
        nfid
      });
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
      <Container className="content mt-5">
        <Row>
          <Col>
            <Card>
              {/* <h3>News Feed</h3> */}
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal />
                    : <Form noValidate onSubmit={handleSubmit}>
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
                        <Label>Header</Label>
                        <Input placeholder="Header" name="header" value={newsFeed.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Caption</Label>
                        <Input placeholder="Caption" name="caption" value={newsFeed.caption} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <Input placeholder="Content" name="content" value={newsFeed.content} onChange={handleChange} type="textarea" rows="3" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Is Featured?" bsSize="lg" name="isFeatured" checked={newsFeed.isFeatured} onChange={handleChange} type="switch" id="NewsFeedIsFeatured" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={newsFeed.active} onChange={handleChange} type="switch" id="NewsFeedActive" />
                      </FormGroup>
                      <FormGroup>
                        <Button type="submit" color="primary" size="lg" className="btn-round w-25 mr-3" disabled={isSubmitting}>Save</Button>
                        <Button type="button" color="secondary" size="lg" className="btn-round w-25 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                        <Button type="button" color="danger" size="lg" className="btn-round w-25" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
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

export default withAuthorization(condition)(AuthNewsFeedView);