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
import StatusBadge from 'components/App/StatusBadge';

const AuthIwiMembersView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [IwiMembersAsArray, setIwiMembersAsArray] = useState([]);
  useEffect(() => {
    const retrieveIwiMembers = async () => {
      const dbIwiMembersAsArray = await props.firebase.getDbIwiMembersAsArray(true);
      setIwiMembersAsArray(dbIwiMembersAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveIwiMembers();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setIwiMembersAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    IwiMembersAsArray.sort((a, b) => {
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
    <InsertButton btnText="Add New" onClick={() => handleAddIwiMembersClick(onClick)} />
  );
  const handleAddIwiMembersClick = async onClick => {
    props.history.push(`/auth/IwiMembers/New`);
    onClick();
  };
  const handleIwiMembersRowClick = async row => {
    props.history.push(`/auth/IwiMembers/${row.imid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbIwiMembers = IwiMembersAsArray.findIndex(dbIwiMembers => dbIwiMembers.imid === updatedChildState.dbId);
    if (indexOfDbIwiMembers > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        IwiMembersAsArray[indexOfDbIwiMembers].active = updatedChildState.dbActive;
      }
      setIwiMembersAsArray(IwiMembersAsArray);
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
                    ? <LoadingOverlayModal color="text-info" />
                    : <BootstrapTable data={IwiMembersAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="iwi-members-table-export"
                      search pagination options={{
                        defaultSortName: 'header',
                        hideSizePerPage: true,
                        noDataText: 'No Iwi Members found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleIwiMembersRowClick
                      }}>
                      <TableHeaderColumn dataField="iwiMemberImageURL" dataSort width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage imageResize="sm" loadingIconSize="sm" alt={row.iwiMemberName} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="iwiMemberName" dataSort>Iwi Member Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="iwiMemberURL" dataSort>Iwi Member URL</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Iwi Member"
                          dbId={row.imid}
                          dbIdName="imid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbIwiMember}
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

export default withAuthorization(condition)(AuthIwiMembersView);
