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
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthEventsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventsAsArray, setEventsAsArray] = useState([]);
  useEffect(() => {
    const retrieveEvents = async () => {
      const dbEventsAsArray = await props.firebase.getDbEventsAsArray(true);
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
  }, [props, isLoading, setIsLoading, setEventsAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    sortArray(eventsAsArray, sortName, sortOrder);
  };
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
                    ? <LoadingOverlayModal color="text-dark" />
                    : <BootstrapTable data={eventsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="events-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Wananga found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEventRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="content" dataSort caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }} dataFormat={(cell, row) => {
                        const {
                          externalUrl
                        } = row;
                        const contentAsText = externalUrl
                          ? externalUrl
                          : draftToText(cell, '');
                        return (
                          <span>{contentAsText}</span>
                        );
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
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
