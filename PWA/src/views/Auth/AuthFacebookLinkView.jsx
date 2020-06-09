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
const INITIAL_STATE = {
  active: true,
  url: '',
  name: '',
  fid: null
};
const AuthFacebookLinkView = props => {
  const isNew = props.match.params.fid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [facebookLink, setfacebookLink] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setfacebookLink(nf => ({
      ...nf,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
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
      url,
      name,
    } = facebookLink;
    let fid = facebookLink.fid;
    let displayIcon = 'success';
    let displayTitle = 'Update Facebook Link Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!name || !url) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'The Name and URL fields are required.';
      } else if (!url.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'Must be a valid URL';
      } else {
        if (isNew) {
          fid = await firebase.saveDbFacebookLink({});
        }
        await firebase.saveDbFacebookLink({
          active: active,
          created: now.toString(),
          createdBy: uid,
          fid: fid,
          name: name,
          updated: now.toString(),
          updatedBy: uid,
          url: url
        });
        if (isNew) {
          handleGotoParentList();
        }
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = 'Update Facebook Link Failed';
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
          fid
        } = match.params;
        await firebase.deleteDbFacebookLink(fid);
        swal.fire({
          icon: 'success',
          title: 'Delete Facebook Link Successful',
          text: 'Your Facebook Link has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: 'Delete Facebook Link Error',
        html: displayMessage
      });
      console.log(`Delete Facebook Link Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/facebookLinks');
  };
  useEffect(() => {
    const retrievefacebookLink = async () => {
      const dbfacebookLink = await props.firebase.getDbFacebookLinkValue(props.match.params.fid);
      const {
        active,
        url,
        name,
        fid
      } = dbfacebookLink;
      setfacebookLink({
        active,
        url,
        name,
        fid
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrievefacebookLink();
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
          <Col xs={12} sm={6}>
            <Card>
              {/* <h3>Facebook Link</h3> */}
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal color="text-light" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Link Name</Label>
                        <Input placeholder="Name" name="name" value={facebookLink.name} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Link</Label>
                        <Input placeholder="URL" name="url" value={facebookLink.url} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={facebookLink.active} onChange={handleChange} type="switch" id="facebookLinkActive" />
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
          <Col xs={12} sm={6}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label><a href={facebookLink.url} target="_blank" rel="noopener noreferrer" className="text-muted">Preview (in another tab/window) <i className="fas fa-external-link-alt" /></a></Label>
                  <iframe
                    allowTransparency="true"
                    allow="encrypted-media"
                    frameborder="0"
                    src={`https://www.facebook.com/plugins/page.php?href=${facebookLink.url}&tabs=timeline%2Cevents%2Cmessages&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                    style={{
                      border: 'none',
                      height: '13.5rem',
                      width: '100%'
                    }}
                    title={facebookLink.name}
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

export default withAuthorization(condition)(AuthFacebookLinkView);
