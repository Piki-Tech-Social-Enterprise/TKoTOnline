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
  const defaultDisplayMesssage = 'Changes saved';
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    cid: null
  };
  const AuthContactView = props => {
    const isNew = props.match.params.cid === 'New';
    const [isLoading, setIsLoading] = useState(true);
    const [contact, setContact] = useState(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = async e => {
      const {
        name,
        value,
        checked
      } = e.target;
      const checkedNames = ['active'];
      const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
      setContact(c => ({
        ...c,
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
        firstName,
        lastName,
        email,
        message
      } = contact;
      let cid = contact.cid;
      let displayType = 'success';
      let displayTitle = 'Update Contact Successful';
      let displayMessage = 'Changes saved';
      try {
        if (displayMessage === defaultDisplayMesssage) {
          if (isNew) {
            cid = await firebase.saveDbContact({});
          }
          await firebase.saveDbContact({
            active: active,
            created: now.toString(),
            createdBy: uid,
            firstName,
            lastName,
            email,
            message,
            cid: cid,
            updated: now.toString(),
            updatedBy: uid
          });
          if (isNew) {
            handleGotoParentList();
          }

        }
          
      } catch (error) {
        displayType = 'error';
        displayTitle = 'Update Contact Failed';
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
            cid
          } = match.params;
          await firebase.deleteDbContact(cid);
          swal.fire({
            type: 'success',
            title: 'Delete Contact Successful',
            text: 'Your Contact has been deleted.'
          });
          handleGotoParentList();
        }
      } catch (error) {
        displayMessage = error.message;
      }
      if (displayMessage) {
        swal.fire({
          type: 'error',
          title: 'Delete Contact Error',
          html: displayMessage
        });
        console.log(`Delete Contact Error: ${displayMessage}`);
      }
    };
    const handleGotoParentList = () => {
      props.history.push('/auth/Contacts');
    };
    useEffect(() => {
      const retrievecontact = async () => {
        const dbcontact = await props.firebase.getDbContactValue(props.match.params.cid);
        const {
          active,
          firstName,
          lastName,
          email,
          message,
          cid
        } = dbcontact;
        setContact({
          active,
          firstName,
          lastName,
          email,
          message,
          cid
        });
        setIsLoading(false);
      };
      if (isLoading) {
        if (!isNew) {
          retrievecontact();
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
                {/* <h3>Contact</h3> */}
                <CardBody>
                  {
                    isLoading
                      ? <LoadingOverlayModal color="text-light" />
                      : <Form noValidate onSubmit={handleSubmit}>
                        <FormGroup>
                          <Label>First Name</Label>
                          <Input placeholder="First Name" name="firstName" value={contact.firstName} onChange={handleChange} type="text" disabled/>
                        </FormGroup>
                        <FormGroup>
                          <Label>Last Name</Label>
                          <Input placeholder="Last Name" name="lastName" value={contact.lastName} onChange={handleChange} type="text" disabled/>
                        </FormGroup>
                        <FormGroup>
                          <Label>email</Label>
                          <Input placeholder="Last Name" name="email" value={contact.email} onChange={handleChange} type="email" disabled/>
                        </FormGroup>
                        <FormGroup>
                          <Label>Message</Label>
                          <Input placeholder="Message" name="message" value={contact.message} onChange={handleChange} type="textarea" disabled />
                        </FormGroup>
                        <FormGroup>
                          <CustomInput label="Un-Seen" name="active" checked={contact.active} onChange={handleChange} type="switch" id="contactActive" />
                        </FormGroup>
                        <FormGroup>
                        <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" onClick={handleGotoParentList} disabled={isSubmitting}>Back</Button>
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
  
  export default withAuthorization(condition)(AuthContactView);
  