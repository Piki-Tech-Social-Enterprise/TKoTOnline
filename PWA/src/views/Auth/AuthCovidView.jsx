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

const covidsRef = '/images/covids';
const covidKeyFormat = '{cvid}';
const covidFilenameFormat = '{filename}';
const covidImageFolderUrlFormat = `${covidsRef}/${covidKeyFormat}/`;
const covidImageUrlFormat = `${covidImageFolderUrlFormat}${covidFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  category: '',
  categoryTags: [],
  content: '',
  date: '',
  externalUrl: '',
  header: '',
  imageUrl: '',
  imageUrlFile: null,
  isFeatured: false,
  cvid: null
};
const AuthCovidView = props => {
  const isNew = props.match.params.cvid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [covid, setCovid] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['isFeatured', 'active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setCovid(nf => ({
      ...nf,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleUploadCallback = async file => {
    const imageUrl = getImageUrl(covidImageUrlFormat, covidKeyFormat, props.match.params.cvid, covidFilenameFormat, file.name);
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
      active,
      categoryTags,
      content,
      date,
      externalUrl,
      header,
      imageUrlFile,
      isFeatured
    } = covid;
    let cvid = covid.cvid;
    let imageUrl = covid.imageUrl;
    let displayIcon = 'error';
    let displayTitle = 'Save Covid Failed';
    let displayMessage = 'Changes saved';
    try {
      if (!imageUrl || !header || !date || (!externalUrl && !content)) {
        displayMessage = 'The Image, Header, Date and External URL/Content fields are required.';
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
          cvid = await firebase.saveDbCovid({});
          if (imageUrlFile && imageUrlFile.name) {
            imageUrl = getImageUrl(covidImageUrlFormat, covidKeyFormat, cvid, covidFilenameFormat, imageUrlFile.name, '');
          }
        }
        await firebase.saveDbCovid({
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
          cvid: cvid,
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
        displayTitle = 'Save Covid Successful';
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
          cvid
        } = match.params;
        const covidImageFolderUrl = covidImageFolderUrlFormat.replace(covidKeyFormat, cvid);
        const storageFiles = await firebase.getStorageFiles(covidImageFolderUrl);
        storageFiles.items.map(async storageFileItem => await storageFileItem.delete());
        await firebase.deleteDbCovid(cvid);
        swal.fire({
          icon: 'success',
          title: 'Delete Covid Successful',
          text: 'Your Covid has been deleted.'
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
        title: 'Delete Covid Error',
        html: displayMessage
      });
      console.log(`Delete Covid Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/CovidList');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const imageUrlFile = e.target.files[0];
      setCovid(nf => ({
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
    window.open(`${REACT_APP_WEB_BASE_URL}/Covid/${covid.cvid}`, '_blank');
  };
  useEffect(() => {
    const retrieveCovid = async () => {
      const dbCovid = await props.firebase.getDbCovidValue(props.match.params.cvid);
      const {
        active,
        category,
        content,
        date,
        externalUrl,
        header,
        imageUrl,
        isFeatured,
        cvid
      } = dbCovid;
      setCovid(nf => ({
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
        cvid
      }));
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveCovid();
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
            : <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={8}>
                  {
                    isSubmitting
                      ? <LoadingOverlayModal text="Saving..." />
                      : null
                  }
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label>External URL</Label>
                        <Input placeholder="External URL" name="externalUrl" value={covid.externalUrl} onChange={handleChange} type="url" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Content</Label>
                        <DraftEditor
                          content={covid.content}
                          onChange={handleChange}
                          uploadCallback={handleUploadCallback}
                        />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Is Featured" name="isFeatured" checked={covid.isFeatured || false} onChange={handleChange} type="switch" id="CovidIsFeatured" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={covid.active} onChange={handleChange} type="switch" id="CovidActive" />
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
                        <Input placeholder="Header" name="header" value={covid.header} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Image</Label>
                        <FirebaseInput
                          value={covid.imageUrl}
                          onChange={handleChange}
                          downloadURLInputProps={{
                            id: 'imageUrl',
                            name: 'imageUrl',
                            placeholder: 'Image',
                            type: 'text'
                          }}
                          downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                          downloadURLFileInputOnChange={handleImageUrlFileChange}
                          downloadURLFormat={covidImageUrlFormat}
                          downloadURLFormatKeyName={covidKeyFormat}
                          downloadURLFormatKeyValue={props.match.params.cvid}
                          downloadURLFormatFileName={covidFilenameFormat}
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
                          value={covid.date}
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
                          value={covid.categoryTags}
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

export default withAuthorization(condition)(AuthCovidView);
