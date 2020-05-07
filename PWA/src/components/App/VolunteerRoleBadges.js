import React, {
    useState,
    useEffect
  } from 'react';
  import {
    Row,
    Col,
    Badge,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button
  } from 'reactstrap';
  import {
    volunteerRole,
    volunteerCoordinatorRole,
    undefinedRole
  } from 'components/Domains/VolunteerRoles';
  import {
    withAuthorization
  } from 'components/Firebase';
  import swal from 'sweetalert2';
  import PropTypes from 'prop-types';
  import LoadingIcon from './LoadingIcon';
  import {
    fromCamelcaseToTitlecase
  } from 'components/App/Utilities';
  
  const propTypes = {
    availableRoles: PropTypes.objectOf(PropTypes.string).isRequired,
    roles: PropTypes.objectOf(PropTypes.string).isRequired,
    vid: PropTypes.string.isRequired,
    onChildUpdate: PropTypes.func
  };
  const defaultProps = {};
  const INITIAL_STATE = {
    isLoading: true,
    vid: '',
    activeRoles: {},
    isSubmitting: false
  };
  const VolunteerRoleBadges = props => {
    const [state, setState] = useState(INITIAL_STATE);
    useEffect(() => {
      if (state.isLoading) {
        setState(s => ({
          ...s,
          isLoading: false,
          activeRoles: [].concat(props.roles)
        }));
      }
    }, [props, state, setState]);
    const handleRoleChange = async e => {
      const element = e.target;
      const {
        name,
        checked
      } = element;
      const activeRoles = {
        ...state.activeRoles
      };
  
      const activeRolesId = `activeRoles_${state.vid}`;
      if(name === `${activeRolesId}_activeRoles[volunteerRole]`) {
        if (checked) {
          activeRoles[volunteerRole] = volunteerRole;
        } else if (!!activeRoles.volunteerRole) {
          delete activeRoles.volunteerRole;
        }
      } else if (name === `${activeRolesId}_activeRoles[volunteerCoordinatorRole]`) {
        if (checked) {
          activeRoles[volunteerCoordinatorRole] = volunteerCoordinatorRole;
        } else if (!!activeRoles.volunteerCoordinatorRole) {
          delete activeRoles.volunteerCoordinatorRole;
        }
      } else if (name === `${activeRolesId}_activeRoles[undefinedRole]`) {
        if (checked) {
          activeRoles[undefinedRole] = undefinedRole;
        } else if (!!activeRoles.undefinedRole) {
          delete activeRoles.undefinedRole;
        }
      } 
      setState(s => ({
        ...s,
        activeRoles: activeRoles
      }));
    };
    const handleSubmit = async e => {
      e.preventDefault();
      const {
        vid,
        activeRoles
      } = state;
      setState(s => ({
        ...s,
        isSubmitting: true
      }));
      await props.firebase.saveDbVolunteer({
        vid: vid,
        roles: activeRoles
      }, handleSaveDbVolunteerComplete);
    };
    const handleSaveDbVolunteerComplete = async error => {
      const {
        vid,
        activeRoles
      } = state,
        activeRolesDiv = document.getElementById(`activeRoles_${vid}`),
        type = 'error',
        title = 'Save Volunteer';
      let text = null;
      if (error) {
        text = typeof error.getMessage === 'function'
          ? error.getMessage()
          : error;
        console.log(`${title} Error: ${text}`);
        swal.fire({
          type: type,
          title: title,
          text: text
        });
      } else {
        await props.onChildUpdate({
          dbId: vid,
          userRoles: activeRoles
        });
        activeRolesDiv.click();
      }
      setState(s => ({
        ...s,
        isSubmitting: false
      }));
    };
    const {
      vid,
      roles
    } = props;
    const {
      activeRoles
    } = state;
    const activeRolesId = `activeRoles_${vid}`;
    return (
      state.isLoading
        ? <LoadingIcon size="sm" />
        : <div>
          <div id={activeRolesId} className="clickable" title="Click to change">
            {
              Object.keys(roles).map(role =>
                <RoleBadge key={role} role={roles[role]} />
              )
            }
          </div>
          <UncontrolledPopover trigger="legacy" placement="auto" target={activeRolesId}>
            <PopoverHeader>Change Volunteer's Roles</PopoverHeader>
            <PopoverBody>
              <Row>
                <Col md="12">
                  <Form noValidate onSubmit={handleSubmit}>
                    {
                      Object.keys(props.availableRoles).map((availableRole, key) => {
                        return (
                          <FormGroup check className="text-left" key={key}>
                            <Label check>
                              <Input id={`${activeRolesId}_activeRoles[${availableRole}]`} name={`${activeRolesId}_activeRoles[${availableRole}]`} type="checkbox" checked={!!activeRoles[availableRole]} onChange={handleRoleChange} />{' '}
                                {fromCamelcaseToTitlecase(availableRole.replace('Role', ''))}
                                <span className="form-check-sign">
                                <span className="check"></span>
                              </span>
                            </Label>
                          </FormGroup>
                        );
                      })
                    }
                    <Button type="submit" block className="btn-round" color="primary" outline disabled={state.isSubmitting}>
                      Update
                      </Button>
                  </Form>
                </Col>
              </Row>
            </PopoverBody>
          </UncontrolledPopover>
        </div>
    );
  }
  const RoleBadge = props => {
    const {
      role
    } = props;
    let color = 'info';
    let roleDisplayName = 'Undefined';
    switch (role) {
      case volunteerRole:
        color = 'warning';
        roleDisplayName = 'Volunteer';
        break;
      case volunteerCoordinatorRole:
        color = 'secondary';
        roleDisplayName = 'Coordinator';
        break;
      case undefinedRole:
      default:
        color = 'info';
        roleDisplayName = 'Undefined';
    }
    return (
      <>
        <Badge color={color}>{roleDisplayName}</Badge>{' '}
      </>
    );
  };
  
  VolunteerRoleBadges.propTypes = propTypes;
  VolunteerRoleBadges.defaultProps = defaultProps;
  
  const condition = authUser => !!authUser && !!authUser.active;
  
  export default withAuthorization(condition)(VolunteerRoleBadges);