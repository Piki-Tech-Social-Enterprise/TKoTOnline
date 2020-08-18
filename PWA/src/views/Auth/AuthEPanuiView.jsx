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
import InputDateTime from 'components/App/InputDateTime';
import {
  DATE_MOMENT_FORMAT
} from 'components/App/Utilities';

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
          // eslint-disable-next-line
        } else if (!url.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
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
            details,
            updated: now.toString(),
            updatedBy: uid,
            eid: eid
          });
        }
      } else {
        displayIcon = 'error';
        displayTitle = `Update E-Panui Failed`;
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
      if (result.isConfirmed) {
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
        url,
        eid,
        details
      } = dbEPanui;
      setEPanui({
        active,
        date,
        name,
        url,
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
                  <Col xs={12} sm={6}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label>Date</Label>
                          <InputDateTime
                            dateFormat={DATE_MOMENT_FORMAT}
                            inputProps={{
                              name: 'date',
                              placeholder: 'Date'
                            }}
                            value={ePanui.date}
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
                          <Label>Name</Label>
                          <Input placeholder="Name" name="name" value={ePanui.name} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>URL</Label>
                          <Input placeholder="URL" name="url" value={ePanui.url} onChange={handleChange} type="url" />
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
                  <Col xs={12} sm={6}>
                    <Card>
                      <CardBody>
                        <FormGroup>
                          <Label><a href={ePanui.url} target="_blank" rel="noopener noreferrer" className="text-muted">Preview (in another tab/window) <i className="fas fa-external-link-alt" /></a></Label>
                          <iframe
                            title={ePanui.name}
                            src={ePanui.url}
                            style={{
                              height: '19.5rem',
                              width: '100%'
                            }}
                          />
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
