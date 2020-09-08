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
import {
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthIwiMembersView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [IwiMembersAsArray, setIwiMembersAsArray] = useState([]);
  useEffect(() => {
    const retrieveIwiMembers = async () => {
      const dbIwiMembersAsArray = await props.firebase.getDbIwiMembersAsArray(true);
      sortArray(dbIwiMembersAsArray, 'iwiMemberName', 'asc');
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
    sortArray(IwiMembersAsArray, sortName, sortOrder);
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
                      insertRow exportCSV csvFileName="iwi-members-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Iwi Members found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleIwiMembersRowClick
                      }}>
                      <TableHeaderColumn dataField="iwiMemberImageURL" dataSort caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage imageResize="sm" loadingIconSize="sm" alt={row.iwiMemberName} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="iwiMemberName" dataSort caretRender={renderCaret}>Iwi Member Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="iwiMemberURL" dataSort caretRender={renderCaret}>Iwi Member URL</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
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
