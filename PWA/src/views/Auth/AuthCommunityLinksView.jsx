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

const AuthCommunityLinksView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [CommunityLinksAsArray, setCommunityLinksAsArray] = useState([]);
  useEffect(() => {
    const retrieveCommunityLinks = async () => {
      const dbCommunityLinksAsArray = await props.firebase.getDbCommunityLinksAsArray(true);
      setCommunityLinksAsArray(dbCommunityLinksAsArray);
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
    CommunityLinksAsArray.sort((a, b) => {
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
      <Container className="content mt-5">
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
                      insertRow exportCSV csvFileName="news-feeds-table-export"
                      search pagination options={{
                        defaultSortName: 'header',
                        hideSizePerPage: true,
                        noDataText: 'No Community links found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleCommunityLinksRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="linkName" dataSort>Link Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="link" dataSort>Link</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
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
