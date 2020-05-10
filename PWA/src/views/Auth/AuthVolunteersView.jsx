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
  import * as Roles from 'components/Domains/VolunteerRoles';
  import VolunteerRoleBadges from 'components/App/VolunteerRoleBadges';
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
        const dbVolunteersAsArray = await props.firebase.getDbVolunteersAsArray(true);
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
      props.history.push(`/auth/Volunteers/${row.vid}`);
    };
    const handleChildUpdate = updatedChildState => {
      const indexOfDbVolunteer = volunteersAsArray.findIndex(dbVolunteers => dbVolunteers.vid === updatedChildState.dbId);
      if (indexOfDbVolunteer > -1) {
        if (updatedChildState.volunteerRoles) {
            volunteersAsArray[indexOfDbVolunteer].roles = updatedChildState.volunteerRoles;
        }
        if (typeof updatedChildState.dbActive === 'boolean') {
            volunteersAsArray[indexOfDbVolunteer].active = updatedChildState.dbActive;
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
                        insertRow exportCSV csvFileName="volunteers-table-export"
                        search pagination options={{
                          defaultSortName: 'email',
                          hideSizePerPage: true,
                          noDataText: 'No Volunteers found.',
                          onSortChange: handleSortChange,
                          insertBtn: createCustomInsertButton,
                          onRowClick: handleUserRowClick
                        }}>
                        <TableHeaderColumn isKey dataField="email" width="35%" dataSort>Email</TableHeaderColumn>
                        <TableHeaderColumn dataField="firstName" dataSort>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="lastName" dataSort>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="roles" dataSort width="125px" dataFormat={(cell, row) => (
                            <VolunteerRoleBadges
                              availableRoles={availableRoles}
                              roles={cell}
                              vid={row.vid}
                              onChildUpdate={handleChildUpdate}
                            />
                          )} >Roles</TableHeaderColumn>
                        <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
                          <StatusBadge
                            dbObjectName="Volunteer"
                            dbId={row.vid}
                            dbIdName="vid"
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
  