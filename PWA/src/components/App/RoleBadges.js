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
  systemAdminRole,
  adminRole,
  basicRole,
  undefinedRole
} from 'components/Domains/Roles';
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
  uid: PropTypes.string.isRequired,
  onChildUpdate: PropTypes.func
};
const defaultProps = {};
const INITIAL_STATE = {
  isLoading: true,
  uid: '',
  activeRoles: {},
  isSubmitting: false
};
const RoleBadges = props => {
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
    const activeRolesId = `activeRoles_${state.uid}`;
    if (name === `${activeRolesId}_activeRoles[systemAdminRole]`) {
      if (checked) {
        activeRoles[systemAdminRole] = systemAdminRole;
      } else if (!!activeRoles.systemAdminRole) {
        delete activeRoles.systemAdminRole;
      }
    } else if (name === `${activeRolesId}_activeRoles[adminRole]`) {
      if (checked) {
        activeRoles[adminRole] = adminRole;
      } else if (!!activeRoles.adminRole) {
        delete activeRoles.adminRole;
      }
    } else if (name === `${activeRolesId}_activeRoles[basicRole]`) {
      if (checked) {
        activeRoles[basicRole] = basicRole;
      } else if (!!activeRoles.basicRole) {
        delete activeRoles.basicRole;
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
      uid,
      activeRoles
    } = state;
    setState(s => ({
      ...s,
      isSubmitting: true
    }));
    await props.firebase.saveDbUser({
      uid: uid,
      roles: activeRoles
    }, handleSaveDbUserComplete);
  };
  const handleSaveDbUserComplete = async error => {
    const {
      uid,
      activeRoles
    } = state,
      activeRolesDiv = document.getElementById(`activeRoles_${uid}`),
      type = 'error',
      title = 'Save User';
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
        dbId: uid,
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
    uid,
    roles
  } = props;
  const {
    activeRoles
  } = state;
  const activeRolesId = `activeRoles_${uid}`;
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
          <PopoverHeader>Change User's Roles</PopoverHeader>
          <PopoverBody>
            <Row>
              <Col md="12">
                <Form noValidate onSubmit={handleSubmit}>
                  {
                    Object.keys(props.availableRoles).map(availableRole => {
                      return (
                        <FormGroup check className="text-left">
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
    case systemAdminRole:
      color = 'warning';
      roleDisplayName = 'System Admin';
      break;
    case adminRole:
      color = 'secondary';
      roleDisplayName = 'Admin';
      break;
    case basicRole:
      color = 'primary';
      roleDisplayName = 'Basic';
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

RoleBadges.propTypes = propTypes;
RoleBadges.defaultProps = defaultProps;

const condition = authUser => !!authUser && !!authUser.active && (!!authUser.roles[systemAdminRole] || !!authUser.roles[adminRole]);

export default withAuthorization(condition)(RoleBadges);