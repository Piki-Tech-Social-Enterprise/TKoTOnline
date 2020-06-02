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
  InputGroup,
  CustomInput,
  Button
} from 'reactstrap';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import swal from 'sweetalert2';

const INITIAL_STATE = {
  active: true,
  date: '',
  name: '',
  url: '',
  eid: null
};
const AuthEPanuiView = props => {
  const isNew = props.match.params.eid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [ePanui, setEPanui] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setEPanui(u => ({
      ...u,
      [name]: useChecked
        ? checked
        : value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const defaultDisplayMesssage = 'Changes saved';
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
      date,
      name,
      url,
      providerData,
      roles,
      details
    } = ePanui;
    let eid = ePanui.eid;
    let displayIcon = 'success';
    let displayTitle = `Update E-Panui Successful`;
    let displayMessage = defaultDisplayMesssage;
    try {
      if (isNew) {
        if (!url || !name || !date) {
          displayMessage = 'Date, Name, and URL are required fields.';
        } else if (!url.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          displayMessage = 'URL is invalid.';
        }
      }
      if (displayMessage === defaultDisplayMesssage) {
        if (isNew) {
          eid = await firebase.saveDbEPanui({
            active,
            created: now.toString(),
            createdBy: uid,
            date,
            name,
            url,
            providerData,
            roles,
            updated: now.toString(),
            updatedBy: uid
          });
          handleGotoParentList();
        } else {
          await firebase.saveDbEPanui({
            active,
            date,
            name,
            url,
            providerData,
            roles,
            details,
            updated: now.toString(),
            updatedBy: uid,
            eid: eid
          });
        }
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = `Update E-Panui Failed`;
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
          eid
        } = match.params;
        await firebase.deleteDbEPanui(eid);
        swal.fire({
          icon: 'success',
          title: `Delete E-Panui Successful`,
          text: `Your E-Panui has been deleted.`
        });
        handleGotoParentList();
      }
    } catch (error) {
      displayMessage = `${error.message}`;
    } finally {
      setIsSubmitting(false);
    }
    if (displayMessage) {
      swal.fire({
        icon: 'error',
        title: `Delete E-Panui Error`,
        html: displayMessage
      });
    }
  };
  const handleGotoParentList = () => {
    props.history.push('/auth/EPanui');
  };
  useEffect(() => {
    const {
      firebase,
      match
    } = props;
    const retrieveEPanui = async () => {
      const dbEPanui = await firebase.getDbEPanuiValue(match.params.eid);
      const {
        active,
        date,
        name,
        roles,
        url,
        providerData,
        eid,
        details
      } = dbEPanui;
      setEPanui({
        active,
        date,
        name,
        roles,
        url,
        providerData,
        eid,
        details: details || INITIAL_STATE.details
      });
      setIsLoading(false);
    };
    if (isLoading) {
      if (!isNew) {
        retrieveEPanui();
      } else {
        setIsLoading(false);
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
            ? <LoadingOverlayModal color="text-aqua" />
            : <>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>Date</Label>
                          <InputGroup>
                            <Input placeholder="Date" name="date" value={ePanui.date} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Name</Label>
                          <InputGroup>
                            <Input placeholder="Name" name="name" value={ePanui.name} onChange={handleChange} type="text" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>URL</Label>
                          <InputGroup>
                            <Input placeholder="URL" name="url" value={ePanui.url} onChange={handleChange} type="url" />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Active</Label><br />
                          <CustomInput label="" name="active" checked={ePanui.active} onChange={handleChange} type="switch" id="EPanuiActive" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Cancel</Button>
                          <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isNew || isSubmitting}>Delete</Button>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </>
        }
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthEPanuiView);
