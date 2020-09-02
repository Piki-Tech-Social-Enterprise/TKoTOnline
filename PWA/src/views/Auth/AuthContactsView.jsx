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
  TableHeaderColumn
} from 'react-bootstrap-table';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
import ContactStatusBadge from 'components/App/ContactStatusBadge';
import moment from 'moment';
import {
  DATE_TIME_MOMENT_FORMAT,
  sortArray,
  renderCaret
} from 'components/App/Utilities';

const AuthContactsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [contactsAsArray, setContactsAsArray] = useState([]);
  useEffect(() => {
    const retrieveContacts = async () => {
      const dbContactsAsArray = await props.firebase.getDbContactsAsArray(true);
      setContactsAsArray(dbContactsAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveContacts();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setContactsAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    sortArray(contactsAsArray, sortName, sortOrder);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbContacts = contactsAsArray.findIndex(dbContacts => dbContacts.cid === updatedChildState.dbId);
    if (indexOfDbContacts > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        contactsAsArray[indexOfDbContacts].active = updatedChildState.dbActive;
      }
      setContactsAsArray(contactsAsArray);
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
                    ? <LoadingOverlayModal color="text-info" />
                    : <BootstrapTable data={contactsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      exportCSV csvFileName="contacts-table-export.csv"
                      search pagination options={{
                        defaultSortName: 'created',
                        defaultSortOrder: 'asc',
                        hideSizePerPage: true,
                        noDataText: 'No Contacts found.',
                        onSortChange: handleSortChange
                      }}>
                      <TableHeaderColumn dataField="created" width="10%" dataSort caretRender={renderCaret} dataFormat={cell => (
                        moment(cell).format(DATE_TIME_MOMENT_FORMAT)
                      )}>Created</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="email" width="20%" dataSort caretRender={renderCaret}>Email</TableHeaderColumn>
                      <TableHeaderColumn dataField="firstName" width="15%" dataSort caretRender={renderCaret}>First Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="lastName" width="15%" dataSort caretRender={renderCaret}>Last Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="message" width="30%" dataSort caretRender={renderCaret} hidden={false} export>Message</TableHeaderColumn>
                      <TableHeaderColumn dataField="subscribed" hidden export>Subscribed</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" width="10%" dataSort caretRender={renderCaret} export={false} dataFormat={(cell, row) => (
                        <ContactStatusBadge
                          dbObjectName="Contact"
                          dbId={row.cid}
                          dbIdName="cid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbContact}
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

export default withAuthorization(condition)(AuthContactsView);
