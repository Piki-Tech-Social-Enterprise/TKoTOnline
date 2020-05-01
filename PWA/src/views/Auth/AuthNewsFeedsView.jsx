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

const AuthNewsFeedsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [newsFeedsAsArray, setNewsFeedsAsArray] = useState([]);
  useEffect(() => {
    const retrieveNewsFeeds = async () => {
      const dbNewsFeedsAsArray = await props.firebase.getDbNewsFeedsAsArray(true);
      setNewsFeedsAsArray(dbNewsFeedsAsArray);
    };
    if (isLoading) {
      retrieveNewsFeeds();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setNewsFeedsAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    newsFeedsAsArray.sort((a, b) => {
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
    <InsertButton btnText="Add New" onClick={() => handleAddNewsFeedClick(onClick)} />
  );
  const handleAddNewsFeedClick = async onClick => {
    props.history.push(`/auth/NewsFeeds/New`);
    onClick();
  };
  const handleNewsFeedRowClick = async row => {
    props.history.push(`/auth/NewsFeeds/${row.nfid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbNewsFeed = newsFeedsAsArray.findIndex(dbNewsFeed => dbNewsFeed.nfid === updatedChildState.dbId);
    if (indexOfDbNewsFeed > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        newsFeedsAsArray[indexOfDbNewsFeed].active = updatedChildState.dbActive;
      }
      setNewsFeedsAsArray(newsFeedsAsArray);
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
                    : <BootstrapTable data={newsFeedsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="news-feeds-table-export"
                      search pagination options={{
                        defaultSortName: 'header',
                        hideSizePerPage: true,
                        noDataText: 'No News Feeds found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleNewsFeedRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage imageResize="sm" loadingIconSize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="caption" dataSort>Caption</TableHeaderColumn>
                      <TableHeaderColumn dataField="content" dataSort width="250px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '250px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="News Feed"
                          dbId={row.nfid}
                          dbIdName="nfid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbNewsFeed}
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

export default withAuthorization(condition)(AuthNewsFeedsView);
