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

const AuthEventsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventsAsArray, setEventsAsArray] = useState([]);
  useEffect(() => {
    const retrieveEvents = async () => {
      const dbEventsAsArray = await props.firebase.getDbEventsAsArray(true);
      dbEventsAsArray.map(dbEvent => {
        const {
          externalUrl
        } = dbEvent;
        dbEvent.contentAsText = externalUrl
          ? externalUrl
          : draftToText(dbEvent.content, '');
        return null;
      });
      sortArray(dbEventsAsArray, 'header', 'asc');
      setEventsAsArray(dbEventsAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveEvents();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddEventClick(onClick)} />
  );
  const handleAddEventClick = async onClick => {
    props.history.push(`/auth/Wananga/New`);
    onClick();
  };
  const handleEventRowClick = async row => {
    props.history.push(`/auth/Wananga/${row.evid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbEvent = eventsAsArray.findIndex(dbEvent => dbEvent.evid === updatedChildState.dbId);
    if (indexOfDbEvent > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        eventsAsArray[indexOfDbEvent].active = updatedChildState.dbActive;
      }
      if (typeof updatedChildState.isFeatured === 'boolean') {
        eventsAsArray[indexOfDbEvent].isFeatured = updatedChildState.isFeatured;
      }
      setEventsAsArray(eventsAsArray);
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
                    : <BootstrapTable data={eventsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="events-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Wananga found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEventRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" imageResize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="isFeatured" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Event"
                          dbId={row.evid}
                          dbIdName="evid"
                          dbFieldName="isFeatured"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbEvent}
                          onChildUpdate={handleChildUpdate}
                          activeOverrideColor="primary"
                          activeOverrideText="Yes"
                          inActiveOverrideColor="secondary"
                          inActiveOverrideText="No"
                        />
                      )}>Is Featured</TableHeaderColumn>
                      <TableHeaderColumn dataField="startDateTime" dataSort sortFunc={handleSort} caretRender={renderCaret}>Start</TableHeaderColumn>
                      <TableHeaderColumn dataField="endDateTime" dataSort sortFunc={handleSort} caretRender={renderCaret}>End</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Event"
                          dbId={row.evid}
                          dbIdName="evid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbEvent}
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

export default withAuthorization(condition)(AuthEventsView);
