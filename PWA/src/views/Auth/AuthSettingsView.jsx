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
  communityLinksDescription: '',
  sid: null
};
const AuthSettingsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSetting] = useState(INITIAL_STATE);
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
      communityLinksDescription,
      volunteersDescription,
      aboutPageDescription
    } = settings;
    let sid = settings.sid;
    let displayIcon = 'success';
    let displayTitle = 'Update setting Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!communityLinksDescription) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'You need to have a description for the community links section.';
      } else if (!volunteersDescription) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'You need to have a description for the volunteers section.';
      }else if (!aboutPageDescription) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'You need to have a description for the About Page.';
      } else {
        await firebase.saveDbSettings({
          created: now.toString(),
          createdBy: uid,
          communityLinksDescription: communityLinksDescription,
          volunteersDescription: volunteersDescription,
          aboutPageDescription: aboutPageDescription,
          sid: sid,
          updated: now.toString(),
          updatedBy: uid
        });
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = 'Updating your Settings has Failed';
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
  useEffect(() => {
    const retrieveSettings = async () => {
      const dbSettings = await props.firebase.getDbSettingsValues(true);
      if (dbSettings) {
        const {
          communityLinksDescription,
          volunteersDescription,
          aboutPageDescription,
          sid
        } = dbSettings;
        console.log(dbSettings);
        setSetting({
          communityLinksDescription,
          volunteersDescription,
          aboutPageDescription,
          sid
        });
      }
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveSettings();
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
                    ? <LoadingOverlayModal color="text-white" />
                    : <Form noValidate onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>Community Links Description</Label>
                        <Input placeholder="Community Links Description" name="communityLinksDescription" value={settings.communityLinksDescription} onChange={handleChange} type="textarea" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Volunteers Description</Label>
                        <Input placeholder="Volunteers Description" name="volunteersDescription" value={settings.volunteersDescription} onChange={handleChange} type="textarea" />
                      </FormGroup>
                      <FormGroup>
                        <Label>About Page Description</Label>
                        <Input placeholder="About Page Description" name="aboutPageDescription" value={settings.aboutPageDescription} onChange={handleChange} type="textarea" />
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

export default withAuthorization(condition)(AuthSettingsView);
