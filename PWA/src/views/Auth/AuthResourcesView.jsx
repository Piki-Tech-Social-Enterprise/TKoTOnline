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

const AuthResourcesView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesAsArray, setResourcesAsArray] = useState([]);
  useEffect(() => {
    const retrieveResources = async () => {
      const dbResourcesAsArray = await props.firebase.getDbResourcesAsArray(true);
      dbResourcesAsArray.map(dbResource => {
        dbResource.contentAsText = draftToText(dbResource.content, '');
        return null;
      });
      sortArray(dbResourcesAsArray, 'header', 'asc');
      setResourcesAsArray(dbResourcesAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveResources();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setResourcesAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddResourceClick(onClick)} />
  );
  const handleAddResourceClick = async onClick => {
    props.history.push(`/auth/Resources/New`);
    onClick();
  };
  const handleResourceRowClick = async row => {
    props.history.push(`/auth/Resources/${row.rid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbResource = resourcesAsArray.findIndex(dbResource => dbResource.rid === updatedChildState.dbId);
    if (indexOfDbResource > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        resourcesAsArray[indexOfDbResource].active = updatedChildState.dbActive;
      }
      if (typeof updatedChildState.isFeatured === 'boolean') {
        resourcesAsArray[indexOfDbResource].isFeatured = updatedChildState.isFeatured;
      }
      setResourcesAsArray(resourcesAsArray);
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
                    : <BootstrapTable data={resourcesAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="resources-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Resources found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleResourceRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" imageResize="sm" alt={row.header} imageURL={cell || ''} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="category" dataSort sortFunc={handleSort} caretRender={renderCaret}>Category</TableHeaderColumn>
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="isFeatured" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Resource"
                          dbId={row.rid}
                          dbIdName="rid"
                          dbFieldName="isFeatured"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbResource}
                          onChildUpdate={handleChildUpdate}
                          activeOverrideColor="primary"
                          activeOverrideText="Yes"
                          inActiveOverrideColor="secondary"
                          inActiveOverrideText="No"
                        />
                      )}>Is Featured</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Resource"
                          dbId={row.rid}
                          dbIdName="rid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbResource}
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

export default withAuthorization(condition)(AuthResourcesView);
