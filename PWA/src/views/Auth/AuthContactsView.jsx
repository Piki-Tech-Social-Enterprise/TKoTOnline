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
  import ContactStatusBadge from 'components/App/ContactStatusBadge';
  
  const AuthContactsView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [ContactsAsArray, setContactsAsArray] = useState([]);

    useEffect(() => {
      const retrieveContacts = async () => {
        const dbContactsAsArray = await props.firebase.getDbContactsAsArray(true);
        console.log('heere', dbContactsAsArray);
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
        ContactsAsArray.sort((a, b) => {
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
      <InsertButton btnText="Add New" onClick={() => handleAddContactsClick(onClick)} />
    );
    const handleAddContactsClick = async onClick => {
      props.history.push(`/auth/Contacts/New`);
      onClick();
    };
    const handleContactsRowClick = async row => {
      props.history.push(`/auth/Contacts/${row.cid}`);
    };
    const handleChildUpdate = updatedChildState => {
      const indexOfDbContacts = ContactsAsArray.findIndex(dbContacts => dbContacts.cid === updatedChildState.dbId);
      if (indexOfDbContacts > -1) {
        if (typeof updatedChildState.dbActive === 'boolean') {
          ContactsAsArray[indexOfDbContacts].active = updatedChildState.dbActive;
        }
        setContactsAsArray(ContactsAsArray);
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
                      : <BootstrapTable data={ContactsAsArray} version="4" bordered={false} condensed hover
                        trClassName="clickable"
                        tableHeaderClass="text-primary"
                        insertRow exportCSV csvFileName="contacts-export"
                        search pagination options={{
                          defaultSortName: 'header',
                          hideSizePerPage: true,
                          noDataText: 'No Contacts found.',
                          onSortChange: handleSortChange,
                          insertBtn: createCustomInsertButton,
                          onRowClick: handleContactsRowClick
                        }}>
                        
                        <TableHeaderColumn isKey dataField="email" width="35%" dataSort>email</TableHeaderColumn>
                        <TableHeaderColumn dataField="firstName" width="25%" dataSort>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="lastName" width="25%" dataSort>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
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
  