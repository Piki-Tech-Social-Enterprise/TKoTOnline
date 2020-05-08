import React, {useEffect, useState} from 'react';
import {
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  Label,
  FormGroup,
  Input,
  UncontrolledTooltip
} from 'reactstrap';
import AuthPanelHeader from 'components/PanelHeader/AuthPanelHeader';
import {
  dashboardPanelChart,
  dashboardShippedProductsChart,
  dashboardAllProductsChart,
  dashboard24HoursPerformanceChart
} from 'variables/charts.jsx';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import Swal from 'sweetalert2';
import * as Roles from '../../components/Domains/VolunteerRoles';

const AuthDashboardView = props => {
  const INITIAL_STATE = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roles: {
      volunteerRole: Roles.volunteerRole
    },
    vid: null
  };
  const INITIAL_ANSWERS = {
      region: '',
      travelDistance: '',
      type: ''
  };

  const [volunteer, setVolunteer] = useState(INITIAL_STATE);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);


useEffect(() => {
  
  const isVoluteer = () => {
    if( props.authUser.vid) {

      retrieveVolunteer();
      Swal.fire({
        icon: 'info',
        title: 'To help us organise work for Volunteers',
        text: 'We need more information',
        showCancelButton: true,
        cancelButtonText: 'Skip'  
      }).then((result) => {
        console.log('result here', result);
        if(result.value === true){
          Swal.mixin({
            icon: 'info',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4']
          }).queue([
            {
              title: 'Question 1',
              input: 'text',
              text: 'What region are you from?',
              inputPlaceholder: 'Region'
            },
            {
              title: 'Question 2',
              text: 'How far are you willing to travel?(kms)',
              input: 'range',
              inputValue: '25',
              inputAttributes: {
                min: 0,
                max: 120,
                step: 1
              },
            },
            {
              title: 'Question 3',
              text: 'Tell us what type of work you like ',
              input: 'text',
              inputPlaceholder: 'Type here...',
              inputAttributes: {
                'aria-label': 'Type your message here'
              }
            }
          ]).then((result) => {
            console.log(result);
            if (result.value) {
              const onboardingAnswers = result.value;
              console.log('onboarding answers', onboardingAnswers[0]);
              setAnswers(ans => ({
                ...ans,
                region: onboardingAnswers[0],
                travelDistance: onboardingAnswers[2],
                type: onboardingAnswers.type
              }));
              console.log('seeting answers', answers);
              Swal.fire({
                title: 'All done!',
                icon:'success',
                confirmButtonText: 'Thanks'
              }).then((result) => {
                  console.log(volunteer.active);
                  addVolunteerDetails();
              })
            }
          })
        }
       
      })
     

    }
  }

  const retrieveVolunteer = async () => {
    const dbVolunteer = await props.firebase.getDbVolunteerValue(props.authUser.vid);
    const {
      active,
      firstName,
      lastName,
      phoneNumber,
      roles,
      email,
      providerData,
      vid,
    } = dbVolunteer;
    console.log(dbVolunteer);
    setVolunteer({
      active,
      firstName,
      lastName,
      phoneNumber,
      roles,
      email,
      providerData,
      vid
    });
  };

  const addVolunteerDetails = async() => {
    console.log('heeeeeeeeeeeeeeeeeeeeeee', answers);
    const now = new Date();
    const firstName = volunteer.firstName;
    const lastName = volunteer.lastName;
    const phoneNumber = volunteer.phoneNumber;
    const email = volunteer.email;
    const providerData = volunteer.providerData;
    const roles = volunteer.roles;
    await props.firebase.saveDbVolunteer({
      active: volunteer.active,
      created: now.toString(),
      createdBy: props.authUser.uid,
      firstName,
      lastName,
      phoneNumber,
      email,
      providerData,
      details: answers,
      roles,
      vid: props.authUser.vid,
      updated: now.toString(),
      updatedBy: props.authUser.uid
    });
  }

  isVoluteer();

}, [props])
  return (
    <>
      <AuthPanelHeader
        size="lg"
        content={
          <Line
            data={dashboardPanelChart.data}
            options={dashboardPanelChart.options}
          />
        }
        bgImage={require('assets/img/tkot/Te-Takarangi-hero-2-2000x1121-80pct.jpg')}
      />
      <div className="content">
        <Row>
          <Col xs={12} md={4}>
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Global Sales</h5>
                <CardTitle tag="h4">Shipped Products</CardTitle>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn-round btn-outline-default btn-icon"
                    color="default"
                  >
                    <i className="now-ui-icons loader_gear" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem>Something else here</DropdownItem>
                    <DropdownItem className="text-danger">
                      Remove data
                      </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={dashboardShippedProductsChart.data}
                    options={dashboardShippedProductsChart.options}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <div className="stats">
                  <i className="now-ui-icons arrows-1_refresh-69" /> Just
                    Updated
                  </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">2018 Sales</h5>
                <CardTitle tag="h4">All products</CardTitle>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="btn-round btn-outline-default btn-icon"
                    color="default"
                  >
                    <i className="now-ui-icons loader_gear" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem>Something else here</DropdownItem>
                    <DropdownItem className="text-danger">
                      Remove data
                      </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={dashboardAllProductsChart.data}
                    options={dashboardAllProductsChart.options}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <div className="stats">
                  <i className="now-ui-icons arrows-1_refresh-69" /> Just
                    Updated
                  </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Email Statistics</h5>
                <CardTitle tag="h4">24 Hours Performance</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={dashboard24HoursPerformanceChart.data}
                    options={dashboard24HoursPerformanceChart.options}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <div className="stats">
                  <i className="now-ui-icons ui-2_time-alarm" /> Last 7 days
                  </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Card className="card-tasks">
              <CardHeader>
                <h5 className="card-category">Backend Development</h5>
                <CardTitle tag="h4">Tasks</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="text-left">
                          Sign contract for "What are conference organizers
                          afraid of?"
                          </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip731609871"
                            type="button"
                          >
                            <i className="now-ui-icons ui-2_settings-90" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731609871"
                          >
                            Edit Task
                            </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip923217206"
                            type="button"
                          >
                            <i className="now-ui-icons ui-1_simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip923217206"
                          >
                            Remove
                            </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="text-left">
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                          </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip907509347"
                            type="button"
                          >
                            <i className="now-ui-icons ui-2_settings-90" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip907509347"
                          >
                            Edit Task
                            </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip496353037"
                            type="button"
                          >
                            <i className="now-ui-icons ui-1_simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip496353037"
                          >
                            Remove
                            </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="text-left">
                          Flooded: One year later, assessing what was lost and
                          what was found when a ravaging rain swept through
                          metro Detroit
                          </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip326247652"
                            type="button"
                          >
                            <i className="now-ui-icons ui-2_settings-90" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip326247652"
                          >
                            Edit Task
                            </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip389516969"
                            type="button"
                          >
                            <i className="now-ui-icons ui-1_simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip389516969"
                          >
                            Remove
                            </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin" /> Updated 3
                    minutes ago
                  </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <CardHeader>
                <h5 className="card-category">All Persons List</h5>
                <CardTitle tag="h4">Employees Stats</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-right">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-right">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-right">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-right">$56,142</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-right">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-right">$78,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

const condition = authUser => !!authUser && !!authUser.active;

export default withAuthorization(condition)(AuthDashboardView);
