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

const solutionsRef = '/images/solutions';
const solutionKeyFormat = '{slid}';
const solutionFilenameFormat = '{filename}';
const solutionImageFolderUrlFormat = `${solutionsRef}/${solutionKeyFormat}/`;
const solutionImageUrlFormat = `${solutionImageFolderUrlFormat}${solutionFilenameFormat}`;
const INITIAL_STATE = {
  active: true,
  solutionImageURL: '',
  solutionImageURLFile: null,
  solutionURL: '',
  solutionName: '',
  slid: null
};
const AuthSolutionView = props => {
  const isNew = props.match.params.slid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setSolution(nf => ({
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
      solutionImageURLFile,
      solutionURL,
      solutionName,
    } = solution;
    let slid = solution.slid;
    let solutionImageURL = solution.solutionImageURL;
    let displayIcon = 'error';
    let displayTitle = 'Save Solution Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!solutionName || !solutionImageURL) {
        displayMessage = 'The Solution Name and Solution Image URL fields are required.';
      } else if (solutionImageURLFile && solutionImageURLFile.size > maxImageFileSize) {
        const {
          size
        } = solutionImageURLFile;
        throw new Error(`Images greater than ${formatBytes(maxImageFileSize)} (${formatInteger(maxImageFileSize)} bytes) cannot be uploaded.<br /><br />Actual image size: ${formatBytes(size)} (${formatInteger(size)} bytes)`);
      } else if (solutionURL && !solutionURL.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayMessage = 'Must be a valid Solution URL';
      } else {
        if (isNew) {
          slid = await firebase.saveDbSolution({});
          if (solutionImageURLFile && solutionImageURLFile.name) {
            solutionImageURL = solutionImageUrlFormat
              .replace(solutionKeyFormat, slid)
              .replace(solutionFilenameFormat, solutionImageURLFile.name);
          }
        }
        await firebase.saveDbSolution({
          active: active,
          created: now.toString(),
          createdBy: uid,
          solutionImageURL,
          solutionURL,
          solutionName,
          slid: slid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (solutionImageURLFile) {
          await firebase.saveStorageFile(solutionImageURL, solutionImageURLFile);
        }
        if (isNew) {
          handleGotoParentList();
        }
        displayIcon = 'success';
        displayTitle = 'Save Solution Successful';
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
          slid
        } = match.params;
        await firebase.deleteDbSolution(slid);
        swal.fire({
          icon: 'success',
          title: 'Delete Solution Successful',
          text: 'Your Solution has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: 'Delete Solution Error',
        html: displayMessage
      });
      console.log(`Delete Solution Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/solutions');
  };
  const handleImageUrlFileChange = async e => {
    e.preventDefault();
    if (e.target && e.target.files && e.target.files.length) {
      const solutionImageURLFile = e.target.files[0];
      setSolution(s => ({
        ...s,
        solutionImageURLFile: solutionImageURLFile
      }));
    }
  };
  useEffect(() => {
    const retrievesolution = async () => {
      const dbSolution = await props.firebase.getDbSolutionValue(props.match.params.slid);
      const {
        active,
        solutionImageURL,
        solutionURL,
        solutionName,
        slid
      } = dbSolution;
      setSolution({
        active,
        solutionImageURL,
        solutionURL,
        solutionName,
        slid
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrievesolution();
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
        <Row>
          <Col xs={12} sm={8}>
            <Card>
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal color="text-light" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Solution Name</Label>
                        <Input placeholder="Solution Name" name="solutionName" value={solution.solutionName} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Solution URL</Label>
                        <Input placeholder="Solution URL" name="solutionURL" value={solution.solutionURL} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={solution.active} onChange={handleChange} type="switch" id="solutionActive" />
                      </FormGroup>
                      <FormGroup>
                        <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                        <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                        <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
                      </FormGroup>
                    </Form>
                }
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={4}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label>Solution Image URL</Label>
                  <FirebaseInput
                    value={solution.solutionImageURL || ''}
                    onChange={handleChange}
                    downloadURLInputProps={{
                      id: 'solutionImageURL',
                      name: 'solutionImageURL',
                      placeholder: 'Solution Image URL',
                      type: 'text'
                    }}
                    downloadURLInputGroupAddonIconClassName="now-ui-icons arrows-1_cloud-upload-94"
                    downloadURLFileInputOnChange={handleImageUrlFileChange}
                    downloadURLFormat={solutionImageUrlFormat}
                    downloadURLFormatKeyName={solutionKeyFormat}
                    downloadURLFormatKeyValue={props.match.params.slid}
                    downloadURLFormatFileName={solutionFilenameFormat}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthSolutionView);
