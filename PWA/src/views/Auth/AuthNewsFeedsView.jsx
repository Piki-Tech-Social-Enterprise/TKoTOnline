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
  draftToText,
  handleSort,
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthNewsFeedsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [newsFeedsAsArray, setNewsFeedsAsArray] = useState([]);
  useEffect(() => {
    const retrieveNewsFeeds = async () => {
      const dbNewsFeedsAsArray = await props.firebase.getDbNewsFeedsAsArray(true);
      dbNewsFeedsAsArray.map(dbNewsFeed => {
        const {
          externalUrl
        } = dbNewsFeed;
        dbNewsFeed.contentAsText = externalUrl
          ? externalUrl
          : draftToText(dbNewsFeed.content, '');
        return null;
      });
      sortArray(dbNewsFeedsAsArray, 'date', 'asc');
      setNewsFeedsAsArray(dbNewsFeedsAsArray);
      setIsLoading(false);
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
      if (typeof updatedChildState.isFeatured === 'boolean') {
        newsFeedsAsArray[indexOfDbNewsFeed].isFeatured = updatedChildState.isFeatured;
      }
      setNewsFeedsAsArray(newsFeedsAsArray);
    }
  };
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
                      insertRow exportCSV csvFileName="news-feeds-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No News Feeds found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleNewsFeedRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" imageResize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="date" dataSort sortFunc={handleSort} caretRender={renderCaret} width="100px">Date</TableHeaderColumn>
                      {/* <TableHeaderColumn dataField="category" dataSort sortFunc={handleSort} caretRender={renderCaret}>Category</TableHeaderColumn> */}
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="isFeatured" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="News Feed"
                          dbId={row.nfid}
                          dbIdName="nfid"
                          dbFieldName="isFeatured"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbNewsFeed}
                          onChildUpdate={handleChildUpdate}
                          activeOverrideColor="primary"
                          activeOverrideText="Yes"
                          inActiveOverrideColor="secondary"
                          inActiveOverrideText="No"
                        />
                      )}>Is Featured</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
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
