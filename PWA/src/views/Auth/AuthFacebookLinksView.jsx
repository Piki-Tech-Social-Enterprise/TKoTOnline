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

const AuthFacebookLinksView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [FacebookLinksAsArray, setFacebookLinksAsArray] = useState([]);
  useEffect(() => {
    const retrieveFacebookLinks = async () => {
      const dbFacebookLinksAsArray = await props.firebase.getDbFacebookLinksAsArray(true);
      setFacebookLinksAsArray(dbFacebookLinksAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveFacebookLinks();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setFacebookLinksAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    FacebookLinksAsArray.sort((a, b) => {
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
    <InsertButton btnText="Add New" onClick={() => handleAddFacebookLinksClick(onClick)} />
  );
  const handleAddFacebookLinksClick = async onClick => {
    props.history.push(`/auth/FacebookLinks/New`);
    onClick();
  };
  const handleFacebookLinksRowClick = async row => {
    props.history.push(`/auth/FacebookLinks/${row.fid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbFacebookLinks = FacebookLinksAsArray.findIndex(dbFacebookLinks => dbFacebookLinks.fid === updatedChildState.dbId);
    if (indexOfDbFacebookLinks > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        FacebookLinksAsArray[indexOfDbFacebookLinks].active = updatedChildState.dbActive;
      }
      setFacebookLinksAsArray(FacebookLinksAsArray);
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
                    : <BootstrapTable data={FacebookLinksAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="news-feeds-table-export"
                      search pagination options={{
                        defaultSortName: 'name',
                        defaultSortOrder: 'asc',
                        hideSizePerPage: true,
                        noDataText: 'No Facebook Links found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleFacebookLinksRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="name" dataSort caretRender={renderCaret}>Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="url" dataSort caretRender={renderCaret}>URL</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Facebook Link"
                          dbId={row.fid}
                          dbIdName="fid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbFacebookLink}
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

export default withAuthorization(condition)(AuthFacebookLinksView);
