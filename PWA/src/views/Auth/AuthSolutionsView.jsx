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

const AuthSolutionsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [SolutionsAsArray, setSolutionsAsArray] = useState([]);
  useEffect(() => {
    const retrieveSolutions = async () => {
      const dbSolutionsAsArray = await props.firebase.getDbSolutionsAsArray(true);
      setSolutionsAsArray(dbSolutionsAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveSolutions();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setSolutionsAsArray]);
  const handleSortChange = async (sortName, sortOrder) => {
    SolutionsAsArray.sort((a, b) => {
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
    <InsertButton btnText="Add New" onClick={() => handleAddSolutionsClick(onClick)} />
  );
  const handleAddSolutionsClick = async onClick => {
    props.history.push(`/auth/Solutions/New`);
    onClick();
  };
  const handleSolutionsRowClick = async row => {
    props.history.push(`/auth/Solutions/${row.slid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbSolutions = SolutionsAsArray.findIndex(dbSolutions => dbSolutions.slid === updatedChildState.dbId);
    if (indexOfDbSolutions > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        SolutionsAsArray[indexOfDbSolutions].active = updatedChildState.dbActive;
      }
      setSolutionsAsArray(SolutionsAsArray);
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
                    : <BootstrapTable data={SolutionsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="solutions-table-export"
                      search pagination options={{
                        defaultSortName: 'header',
                        hideSizePerPage: true,
                        noDataText: 'No Solutions found.',
                        onSortChange: handleSortChange,
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleSolutionsRowClick
                      }}>
                      <TableHeaderColumn isKey dataField="solutionName" dataSort>Solution Name</TableHeaderColumn>
                      <TableHeaderColumn dataField="solutionURL" dataSort>Solution URL</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Solution"
                          dbId={row.slid}
                          dbIdName="slid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbSolution}
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

export default withAuthorization(condition)(AuthSolutionsView);
