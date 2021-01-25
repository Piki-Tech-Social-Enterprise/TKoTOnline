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

const AuthCovidListView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [covidListAsArray, setCovidListAsArray] = useState([]);
  useEffect(() => {
    const retrieveCovidList = async () => {
      const dbCovidListAsArray = await props.firebase.getDbCovidListAsArray(true);
      dbCovidListAsArray.map(dbCovid => {
        const {
          externalUrl
        } = dbCovid;
        dbCovid.contentAsText = externalUrl
          ? externalUrl
          : draftToText(dbCovid.content, '');
        return null;
      });
      sortArray(dbCovidListAsArray, 'date', 'asc');
      setCovidListAsArray(dbCovidListAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveCovidList();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setCovidListAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddCovidClick(onClick)} />
  );
  const handleAddCovidClick = async onClick => {
    props.history.push(`/auth/CovidList/New`);
    onClick();
  };
  const handleCovidRowClick = async row => {
    props.history.push(`/auth/CovidList/${row.cvid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbCovid = covidListAsArray.findIndex(dbCovid => dbCovid.cvid === updatedChildState.dbId);
    if (indexOfDbCovid > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        covidListAsArray[indexOfDbCovid].active = updatedChildState.dbActive;
      }
      if (typeof updatedChildState.isFeatured === 'boolean') {
        covidListAsArray[indexOfDbCovid].isFeatured = updatedChildState.isFeatured;
      }
      setCovidListAsArray(covidListAsArray);
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
                    : <BootstrapTable data={covidListAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="covid-list-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Covid List found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleCovidRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" imageResize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="date" dataSort sortFunc={handleSort} caretRender={renderCaret} width="100px">Date</TableHeaderColumn>
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="isFeatured" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Covid"
                          dbId={row.cvid}
                          dbIdName="cvid"
                          dbFieldName="isFeatured"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbCovid}
                          onChildUpdate={handleChildUpdate}
                          activeOverrideColor="primary"
                          activeOverrideText="Yes"
                          inActiveOverrideColor="secondary"
                          inActiveOverrideText="No"
                        />
                      )}>Is Featured</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Covid"
                          dbId={row.cvid}
                          dbIdName="cvid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbCovid}
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

export default withAuthorization(condition)(AuthCovidListView);
