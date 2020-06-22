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
  solutionURL: '',
  solutionName: '',
  slid: null
};
const AuthSolutionView = props => {
  const isNew = props.match.params.slid === 'New';
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setsolution] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = async e => {
    const {
      name,
      value,
      checked
    } = e.target;
    const checkedNames = ['active'];
    const useChecked = checkedNames.findIndex(checkedName => checkedName === name) > -1;
    setsolution(nf => ({
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
      solutionURL,
      solutionName,
    } = solution;
    let slid = solution.slid;
    let displayIcon = 'success';
    let displayTitle = 'Update Solution Successful';
    let displayMessage = 'Changes saved';
    try {
      if (!solutionName || !solutionURL) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'The Solution Name and Solution URL fields are required.';
      } else if (!solutionURL.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)) {
        displayTitle = 'Failed';
        displayIcon = 'error';
        displayMessage = 'Must be a valid Solution URL';
      } else {
        if (isNew) {
          slid = await firebase.saveDbSolution({});
        }
        await firebase.saveDbSolution({
          active: active,
          created: now.toString(),
          createdBy: uid,
          solutionURL,
          solutionName,
          slid: slid,
          updated: now.toString(),
          updatedBy: uid
        });
        if (isNew) {
          handleGotoParentList();
        }
      }
    } catch (error) {
      displayIcon = 'error';
      displayTitle = 'Update Solution Failed';
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
  useEffect(() => {
    const retrievesolution = async () => {
      const dbSolution = await props.firebase.getDbSolutionValue(props.match.params.slid);
      const {
        active,
        solutionURL,
        solutionName,
        slid
      } = dbSolution;
      setsolution({
        active,
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
          <Col>
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
        </Row>
      </Container>
    </>
  )
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthSolutionView);
