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

const AuthEventsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [EventsAsArray, setEventsAsArray] = useState([]);
  useEffect(() => {
    const retrieveEvents = async () => {
      const dbEventsAsArray = await props.firebase.getDbEventsAsArray(true);
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
    EventsAsArray.sort((a, b) => {
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
    <InsertButton btnText="Add New" onClick={() => handleAddEventsClick(onClick)} />
  );
  const handleAddEventsClick = async onClick => {
    props.history.push(`/auth/Wananga/New`);
    onClick();
  };
  const handleEventsRowClick = async row => {
    props.history.push(`/auth/Wananga/${row.evid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbEvents = EventsAsArray.findIndex(dbEvents => dbEvents.evid === updatedChildState.dbId);
    if (indexOfDbEvents > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        EventsAsArray[indexOfDbEvents].active = updatedChildState.dbActive;
      }
      setEventsAsArray(EventsAsArray);
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
                    : <BootstrapTable data={EventsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="events-table-export"
                      search pagination options={{
                        defaultSortName: 'header',
                        hideSizePerPage: true,
                        noDataText: 'No Events found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEventsRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="eventName" dataSort>Event Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="eventURL" dataSort>Event URL</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
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
