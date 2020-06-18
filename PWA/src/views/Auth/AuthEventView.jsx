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
  eventURL: '',
  eventName: '',
  evid: null
};
const AuthEventView = props => {
  const isNew = props.match.params.evid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [event, setevent] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setevent(nf => ({
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
      eventURL,
      eventName,
    } = event;
    let evid = event.evid;
    let displayIcon = 'success';
    let displayTitle = 'Update Event Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!eventName || !eventURL) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'The Event Name and Event URL fields are required.';
      } else if (!eventURL.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'Must be a valid Event URL';
      } else {
        if (isNew) {
          evid = await firebase.saveDbEvent({});
        }
        await firebase.saveDbEvent({
          active: active,
          created: now.toString(),
          createdBy: uid,
          eventURL,
          eventName,
          evid: evid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (isNew) {
          handleGotoParentList();
        }
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = 'Update Event Failed';
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
          evid
        } = match.params;
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
    props.history.push('/auth/events');
  };
  useEffect(() => {
    const retrieveevent = async () => {
      const dbEvent = await props.firebase.getDbEventValue(props.match.params.evid);
      const {
        active,
        eventURL,
        eventName,
        evid
      } = dbEvent;
      setevent({
        active,
        eventURL,
        eventName,
        evid
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveevent();
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
              <CardBody>
                {
                  isLoading
                    ? <LoadingOverlayModal color="text-light" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Event Name</Label>
                        <Input placeholder="Event Name" name="eventName" value={event.eventName} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Event URL</Label>
                        <Input placeholder="Event URL" name="eventURL" value={event.eventURL} onChange={handleChange} type="text" />
                      </FormGroup>
                      <FormGroup>
                        <CustomInput label="Active" name="active" checked={event.active} onChange={handleChange} type="switch" id="eventActive" />
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

export default withAuthorization(condition)(AuthEventView);
