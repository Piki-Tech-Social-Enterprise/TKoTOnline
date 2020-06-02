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

const AuthEPanuiListView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [ePanuiListAsArray, setEPanuiListAsArray] = useState([]);
  useEffect(() => {
    const retrieveEPanuiList = async () => {
      const dbEPanuiListAsArray = await props.firebase.getDbEPanuiListAsArray(true);
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
  const handleSortChange = async (sortName, sortOrder) => {
    ePanuiListAsArray.sort((a, b) => {
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
                    ? <LoadingOverlayModal color="text-gray" />
                    : <BootstrapTable data={ePanuiListAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="ePanuiList-table-export"
                      search pagination options={{
                        defaultSortName: 'date',
                        hideSizePerPage: true,
                        noDataText: 'No E-Panui found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleEPanuiRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="date" dataSort>Date</TableHeaderColumn>
                      <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="url" dataSort>URL</TableHeaderColumn>
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
