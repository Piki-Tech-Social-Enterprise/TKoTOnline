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
  import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
  import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
  import * as Roles from 'components/Domains/Roles';
  import RoleBadges from 'components/App/RoleBadges';
  import StatusBadge from 'components/App/StatusBadge';
  
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
  const AuthVolunteersView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [volunteersAsArray, setVolunteersAsArray] = useState([]);
    const availableRoles = getAvailableRoles();
    useEffect(() => {
      const retrieveVolunteers = async () => {
        const dbVolunteersAsArray = await props.firebase.getDbUsersAsArray(true);
        setVolunteersAsArray(dbVolunteersAsArray);
      };
      if (isLoading) {
        retrieveVolunteers();
      }
      return () => {
        if (isLoading) {
          setIsLoading(false);
        }
      };
    }, [props, isLoading, setIsLoading, setVolunteersAsArray]);
    const handleSortChange = async (sortName, sortOrder) => {
        volunteersAsArray.sort((a, b) => {
        const aValue = a[sortName];
        const bValue = b[sortName];
        return (
          (aValue > bValue)
            ? (sortOrder === 'asc')
              ? 1
              : -1
            : (bValue > aValue)
              ? (sortOrder === 'asc')
                ? -1
                : 1
              : 0
        );
      });
    };
    const createCustomInsertButton = onClick => (
      <InsertButton btnText="Add New" onClick={() => handleAddUserClick(onClick)} />
    );
    const handleAddUserClick = async onClick => {
      props.history.push(`/auth/Volunteers/New`);
      onClick();
    };
    const handleUserRowClick = async row => {
      props.history.push(`/auth/Volunteers/${row.uid}`);
    };
    const handleChildUpdate = updatedChildState => {
      const indexOfDbUser = volunteersAsArray.findIndex(dbUser => dbUser.uid === updatedChildState.dbId);
      if (indexOfDbUser > -1) {
        if (updatedChildState.userRoles) {
            volunteersAsArray[indexOfDbUser].roles = updatedChildState.userRoles;
        }
        if (typeof updatedChildState.dbActive === 'boolean') {
            volunteersAsArray[indexOfDbUser].active = updatedChildState.dbActive;
        }
        setVolunteersAsArray(volunteersAsArray);
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
                      : <BootstrapTable data={volunteersAsArray} version="4" bordered={false} condensed hover
                        trClassName="clickable"
                        tableHeaderClass="text-primary"
                        insertRow exportCSV csvFileName="users-table-export"
                        search pagination options={{
                          defaultSortName: 'email',
                          hideSizePerPage: true,
                          noDataText: 'No Users found.',
                          onSortChange: handleSortChange,
                          insertBtn: createCustomInsertButton,
                          onRowClick: handleUserRowClick
                        }}>
                        <TableHeaderColumn isKey dataField="email" dataSort>Email</TableHeaderColumn>
                        <TableHeaderColumn dataField="displayName" dataSort>Display Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="roles" dataSort width="125px" dataFormat={(cell, row) => (
                            <RoleBadges
                              availableRoles={availableRoles}
                              roles={cell}
                              uid={row.uid}
                              onChildUpdate={handleChildUpdate}
                            />
                          )} >Roles</TableHeaderColumn>
                        <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
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
  
  export default withAuthorization(condition)(AuthVolunteersView);
  