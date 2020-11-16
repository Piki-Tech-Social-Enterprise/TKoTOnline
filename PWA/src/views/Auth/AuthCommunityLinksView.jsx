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
import StatusBadge from 'components/App/StatusBadge';
import {
  handleSort,
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthCommunityLinksView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [CommunityLinksAsArray, setCommunityLinksAsArray] = useState([]);
  useEffect(() => {
    const retrieveCommunityLinks = async () => {
      const dbCommunityLinksAsArray = await props.firebase.getDbCommunityLinksAsArray(true);
      sortArray(dbCommunityLinksAsArray, 'linkName', 'asc');
      setCommunityLinksAsArray(dbCommunityLinksAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveCommunityLinks();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setCommunityLinksAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    sortArray(CommunityLinksAsArray, sortName, sortOrder);
  };
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddCommunityLinksClick(onClick)} />
  );
  const handleAddCommunityLinksClick = async onClick => {
    props.history.push(`/auth/CommunityLinks/New`);
    onClick();
  };
  const handleCommunityLinksRowClick = async row => {
    props.history.push(`/auth/CommunityLinks/${row.clid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbCommunityLinks = CommunityLinksAsArray.findIndex(dbCommunityLinks => dbCommunityLinks.clid === updatedChildState.dbId);
    if (indexOfDbCommunityLinks > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        CommunityLinksAsArray[indexOfDbCommunityLinks].active = updatedChildState.dbActive;
      }
      setCommunityLinksAsArray(CommunityLinksAsArray);
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
                    : <BootstrapTable data={CommunityLinksAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="community-links-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Community Links found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleCommunityLinksRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="linkName" dataSort sortFunc={handleSort} caretRender={renderCaret}>Link Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="link" dataSort sortFunc={handleSort} caretRender={renderCaret}>Link</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Community Link"
                          dbId={row.clid}
                          dbIdName="clid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbCommunityLink}
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

export default withAuthorization(condition)(AuthCommunityLinksView);
