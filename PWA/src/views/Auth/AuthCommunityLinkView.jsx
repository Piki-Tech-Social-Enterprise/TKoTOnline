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
  link: '',
  linkName: '',
  clid: null
};
const AuthCommunityLinkView = props => {
  const isNew = props.match.params.clid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [communityLink, setcommunityLink] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setcommunityLink(nf => ({
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
      link,
      linkName,
    } = communityLink;
    let clid = communityLink.clid;
    let displayType = 'success';
    let displayTitle = 'Update Community link Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!linkName || !link) {
        displayTitle = 'Failed';
        displayType = 'error';
        displayMessage = 'The Link Name and link fields are required.';
      } else if (!link.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayTitle = 'Failed';
        displayType = 'error';
        displayMessage = 'Must be a valid link';
      }else {
          if (isNew) {
            clid = await firebase.saveDbCommunityLink({});
          }
          await firebase.saveDbCommunityLink({
            active: active,
            created: now.toString(),
            createdBy: uid,
            link,
            linkName,
            clid: clid,
            updated: now.toString(),
            updatedBy: uid
          });
          if (isNew) {
            handleGotoParentList();
          }
        }
    } catch (error) {
      displayType = 'error';
      displayTitle = 'Update Community link Failed';
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
          clid
        } = match.params;
        await firebase.deleteDbCommunityLink(clid);
        swal.fire({
          type: 'success',
          title: 'Delete Community link Successful',
          text: 'Your Community link has been deleted.'
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = error.message;
    }
    if (displayMessage) {
      swal.fire({
        type: 'error',
        title: 'Delete Community link Error',
        html: displayMessage
      });
      console.log(`Delete Community link Error: ${displayMessage}`);
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/communityLinks');
  };
  useEffect(() => {
    const retrievecommunityLink = async () => {
      const dbcommunityLink = await props.firebase.getDbCommunityLinkValue(props.match.params.clid);
      const {
        active,
        link,
        linkName,
        clid
      } = dbcommunityLink;
      setcommunityLink({
        active,
        link,
        linkName,
        clid
      });
    };
    if (isLoading) {
      if (!isNew) {
        retrievecommunityLink();
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
          <Col>
            <Card>
              {/* <h3>Community link</h3> */}
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal color="text-light" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Link Name</Label>
                        <Input placeholder="Link name" name="linkName" value={communityLink.linkName} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Link</Label>
                        <Input placeholder="link" name="link" value={communityLink.link} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={communityLink.active} onChange={handleChange} type="switch" id="communityLinkActive" />
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
        </Row>
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthCommunityLinkView);
