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
    communityLinkDescritpion: '',
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
        communityLinkDescritpion
      } = setting;
      let sid = setting.sid;
      let displayType = 'success';
      let displayTitle = 'Update setting Successful';
      let displayMessage = 'Changes saved';
      try {
        if (!communityLinkDescritpion) {
          displayTitle = 'Failed';
          displayType = 'error';
          displayMessage = 'You need to have a description for the community links section.';
        } else {
            await firebase.saveDbSetting({
              created: now.toString(),
              createdBy: uid,
              communityLinkDescritpion: communityLinkDescritpion,
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
    useEffect(() => {
      const retrieveSetting = async () => {
        const dbSetting = await props.firebase.getDbSettingsValues(true);
        const {
          communityLinkDescritpion,
          sid
        } = dbSetting;
        setSetting({
          communityLinkDescritpion,
          sid
        });
      };
      if (isLoading) {
        retrieveSetting();
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
                          <Label>Community Links Describtion</Label>
                          <Input placeholder="community links description" name="communityLinkDescritpion" value={setting.communityLinkDescritpion} onChange={handleChange} type="textarea" />
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="primary" size="lg" className="btn-round w-25 px-0 mr-3" disabled={isSubmitting}>Save</Button>
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
  