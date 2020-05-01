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
    Button
  } from 'reactstrap';
  import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
  import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
  import swal from 'sweetalert2';
  const INITIAL_STATE = {
    settingText: '',
    settingName: '',
    sid: null
  };
  const AuthSettingView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [setting, setSetting] = useState(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = async e => {
      const {
        name,
        value,
        checked
      } = e.target;
      const checkedNames = ['active'];
      const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
      setSetting(nf => ({
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
        settingName,
        settingText,
      } = setting;
      let sid = setting.sid;
      let displayType = 'success';
      let displayTitle = 'Update setting Successful';
      let displayMessage = 'Changes saved';
      try {
        if (!settingName || !settingText) {
          displayTitle = 'Failed';
          displayType = 'error';
          displayMessage = 'The Setting Name and text are required.';
        } else {
            await firebase.saveDbSetting({
              created: now.toString(),
              createdBy: uid,
              settingName,
              settingText,
              sid: sid,
              updated: now.toString(),
              updatedBy: uid
            });
          }
      } catch (error) {
        displayType = 'error';
        displayTitle = 'Updating your Settings has Failed';
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
            cancelButton: 'btn btn-outline-setting',
          }
        });
        if (!!result.value) {
          const {
            firebase,
            match
          } = props;
          const {
            sid
          } = match.params;
          await firebase.deleteDbSetting(sid);
          swal.fire({
            type: 'success',
            title: 'Delete Setting Successful',
            text: 'Your Settings has been deleted.'
          });
        }
      } catch (error) {
        displayMessage = error.message;
      }
      if (displayMessage) {
        swal.fire({
          type: 'error',
          title: 'Delete Setting Error',
          html: displayMessage
        });
        console.log(`Delete Setting Error: ${displayMessage}`);
      }
    };
    useEffect(() => {
      const retrieveSetting = async sid => {
        const dbSetting = await props.firebase.getDbSettingValue(sid);
        console.log('dddddddddddddddddddd', dbSetting);
        const {
          settingText,
          settingName
        } = dbSetting;
        setSetting({
          settingText,
          settingName,
          sid
        });
      };
      if (isLoading) {
        retrieveSetting('"Xx--xX"');
      }
      return () => {
        if (isLoading) {
          setIsLoading(false);
        }
      };
    }, [props, isLoading, setIsLoading]);
    return (
      <>
        <div className="panel-header panel-header-xs" />
        <Container className="content">
          <Row>
            <Col>
              <Card>
                {/* <h3>Setting</h3> */}
                <CardBody>
                  {
                    isLoading
                      ? <LoadingOverlayModal />
                      : <Form noValidate onSubmit={handleSubmit}>
                        <FormGroup>
                          <Label>Setting Name</Label>
                          <Input placeholder="setting name" name="settingName" value={setting.settingName} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Label>Text</Label>
                          <Input placeholder="setting" name="settingText" value={setting.settingText} onChange={handleChange} type="text" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
                          <Button type="button" color="secondary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Cancel</Button>
                          <Button type="button" color="danger" size="lg" className="btn-round w-25 px-0" onClick={handleDeleteClick} disabled={isSubmitting}>Delete</Button>
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
  
  export default withAuthorization(condition)(AuthSettingView);
  