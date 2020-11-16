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
import {
  handleSort,
  sortArray,
  renderCaret
} from 'components/App/Utilities';
import FirebaseImage from 'components/App/FirebaseImage';

const AuthEPanuiListView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ePanuiListAsArray, setEPanuiListAsArray] = useState([]);
  useEffect(() => {
    const retrieveEPanuiList = async () => {
      const dbEPanuiListAsArray = await props.firebase.getDbEPanuiListAsArray(true);
      sortArray(dbEPanuiListAsArray, 'date', 'asc');
      setEPanuiListAsArray(dbEPanuiListAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveEPanuiList();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setEPanuiListAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddEPanuiClick(onClick)} />
  );
  const handleAddEPanuiClick = async onClick => {
    props.history.push(`/auth/EPanui/New`);
    onClick();
  };
  const handleEPanuiRowClick = async row => {
    props.history.push(`/auth/EPanui/${row.eid}`);
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
                    : <BootstrapTable data={ePanuiListAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="ePanuiList-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No E-Pānui found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEPanuiRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" alt={row.name} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn dataField="name" dataSort sortFunc={handleSort} caretRender={renderCaret} width="40%">Name</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="date" dataSort sortFunc={handleSort} caretRender={renderCaret} width="20%">Date</TableHeaderColumn>
                      <TableHeaderColumn dataField="url" dataSort sortFunc={handleSort} caretRender={renderCaret}>URL</TableHeaderColumn>
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

export default withAuthorization(condition)(AuthEPanuiListView);
