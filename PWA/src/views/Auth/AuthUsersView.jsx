import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap';
import {
  BootstrapTable,
  TableHeaderColumn,
  InsertButton
} from 'react-bootstrap-table';
import FirebaseImage from 'components/App/FirebaseImage';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import * as Roles from 'components/Domains/Roles';
import RoleBadges from 'components/App/RoleBadges';
import StatusBadge from 'components/App/StatusBadge';
import {
  handleSort,
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const getAvailableRoles = () => {
  const availableRoles = {};
  Object.keys(Roles).map(role => {
    if (role !== Roles.undefinedRole) {
      availableRoles[role] = role;
    }
    return null;
  });
  return availableRoles;
};
const AuthUsersView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [usersAsArray, setUsersAsArray] = useState([]);
  const availableRoles = getAvailableRoles();
  useEffect(() => {
    const retrieveUsers = async () => {
      const dbUsersAsArray = await props.firebase.getDbUsersAsArray(true);
      sortArray(dbUsersAsArray, 'email', 'asc');
      setUsersAsArray(dbUsersAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveUsers();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setUsersAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddUserClick(onClick)} />
  );
  const handleAddUserClick = async onClick => {
    props.history.push(`/auth/Users/New`);
    onClick();
  };
  const handleUserRowClick = async row => {
    props.history.push(`/auth/Users/${row.uid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbUser = usersAsArray.findIndex(dbUser => dbUser.uid === updatedChildState.dbId);
    if (indexOfDbUser > -1) {
      if (updatedChildState.userRoles) {
        usersAsArray[indexOfDbUser].roles = updatedChildState.userRoles;
      }
      if (typeof updatedChildState.dbActive === 'boolean') {
        usersAsArray[indexOfDbUser].active = updatedChildState.dbActive;
      }
      setUsersAsArray(usersAsArray);
    }
  }
  return (
    <>
      <div className="panel-header panel-header-xs" />
      <Container className="content">
        <Row>
          <Col>
            <Card>
              <CardBody className="table-responsive">
                {
                  isLoading
                    ? <LoadingOverlayModal />
                    : <BootstrapTable data={usersAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="users-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Users found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleUserRowClick
                      }}>
                      <TableHeaderColumn dataField="photoURL" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" alt={row.displayName} imageURL={cell} />
                      )}>Photo</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="email" dataSort sortFunc={handleSort} caretRender={renderCaret}>Email</TableHeaderColumn>
                      <TableHeaderColumn dataField="displayName" dataSort sortFunc={handleSort} caretRender={renderCaret}>Display Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="roles" dataSort sortFunc={handleSort} caretRender={renderCaret} width="125px" dataFormat={(cell, row) => (
                        <RoleBadges
                          availableRoles={availableRoles}
                          roles={cell}
                          uid={row.uid}
                          onChildUpdate={handleChildUpdate}
                        />
                      )} >Roles</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="User"
                          dbId={row.uid}
                          dbIdName="uid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbUser}
                          onChildUpdate={handleChildUpdate}
                        />
                      )}>Status</TableHeaderColumn>
                    </BootstrapTable>
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

export default withAuthorization(condition)(AuthUsersView);
