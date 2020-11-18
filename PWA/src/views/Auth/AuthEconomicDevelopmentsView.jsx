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

const AuthEconomicDevelopmentsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [economicDevelopmentsAsArray, setEconomicDevelopmentsAsArray] = useState([]);
  useEffect(() => {
    const retrieveEconomicDevelopments = async () => {
      const dbEconomicDevelopmentsAsArray = await props.firebase.getDbEconomicDevelopmentsAsArray(true);
      dbEconomicDevelopmentsAsArray.map(dbEconomicDevelopment => {
        dbEconomicDevelopment.contentAsText = draftToText(dbEconomicDevelopment.content, '');
        return null;
      });
      sortArray(dbEconomicDevelopmentsAsArray, 'header', 'asc');
      setEconomicDevelopmentsAsArray(dbEconomicDevelopmentsAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveEconomicDevelopments();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setEconomicDevelopmentsAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddEconomicDevelopmentClick(onClick)} />
  );
  const handleAddEconomicDevelopmentClick = async onClick => {
    props.history.push(`/auth/EconomicDevelopments/New`);
    onClick();
  };
  const handleEconomicDevelopmentRowClick = async row => {
    props.history.push(`/auth/EconomicDevelopments/${row.edid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbEconomicDevelopment = economicDevelopmentsAsArray.findIndex(dbEconomicDevelopment => dbEconomicDevelopment.edid === updatedChildState.dbId);
    if (indexOfDbEconomicDevelopment > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        economicDevelopmentsAsArray[indexOfDbEconomicDevelopment].active = updatedChildState.dbActive;
      }
      if (typeof updatedChildState.isFeatured === 'boolean') {
        economicDevelopmentsAsArray[indexOfDbEconomicDevelopment].isFeatured = updatedChildState.isFeatured;
      }
      setEconomicDevelopmentsAsArray(economicDevelopmentsAsArray);
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
                    : <BootstrapTable data={economicDevelopmentsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="economicDevelopments-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Economic Developments found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEconomicDevelopmentRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" alt={row.header} imageURL={cell || ''} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="category" dataSort sortFunc={handleSort} caretRender={renderCaret}>Catgory</TableHeaderColumn>
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="isFeatured" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Economic Development"
                          dbId={row.edid}
                          dbIdName="edid"
                          dbFieldName="isFeatured"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbEconomicDevelopment}
                          onChildUpdate={handleChildUpdate}
                          activeOverrideColor="primary"
                          activeOverrideText="Yes"
                          inActiveOverrideColor="secondary"
                          inActiveOverrideText="No"
                        />
                      )}>Is Featured</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Economic Development"
                          dbId={row.edid}
                          dbIdName="edid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbEconomicDevelopment}
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

export default withAuthorization(condition)(AuthEconomicDevelopmentsView);
