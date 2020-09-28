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

const AuthProjectsView = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [projectsAsArray, setProjectsAsArray] = useState([]);
  useEffect(() => {
    const retrieveProjects = async () => {
      const dbProjectsAsArray = await props.firebase.getDbProjectsAsArray(true);
      dbProjectsAsArray.map(dbProject => {
        dbProject.contentAsText = draftToText(dbProject.content, '');
        return null;
      });
      sortArray(dbProjectsAsArray, 'header', 'asc');
      setProjectsAsArray(dbProjectsAsArray);
      setIsLoading(false);
    };
    if (isLoading) {
      retrieveProjects();
    }
    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [props, isLoading, setIsLoading, setProjectsAsArray]);
  const createCustomInsertButton = onClick => (
    <InsertButton btnText="Add New" onClick={() => handleAddProjectClick(onClick)} />
  );
  const handleAddProjectClick = async onClick => {
    props.history.push(`/auth/Projects/New`);
    onClick();
  };
  const handleProjectRowClick = async row => {
    props.history.push(`/auth/Projects/${row.pid}`);
  };
  const handleChildUpdate = updatedChildState => {
    const indexOfDbProject = projectsAsArray.findIndex(dbProject => dbProject.pid === updatedChildState.dbId);
    if (indexOfDbProject > -1) {
      if (typeof updatedChildState.dbActive === 'boolean') {
        projectsAsArray[indexOfDbProject].active = updatedChildState.dbActive;
      }
      setProjectsAsArray(projectsAsArray);
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
                    ? <LoadingOverlayModal color="text-dark" />
                    : <BootstrapTable data={projectsAsArray} version="4" bordered={false} condensed hover
                      trClassName="clickable"
                      tableHeaderClass="text-primary"
                      insertRow exportCSV csvFileName="projects-table-export.csv"
                      search pagination options={{
                        hideSizePerPage: true,
                        noDataText: 'No Projects found.',
                        insertBtn: createCustomInsertButton,
                        onRowClick: handleProjectRowClick
                      }}>
                      <TableHeaderColumn dataField="imageUrl" dataSort sortFunc={handleSort} caretRender={renderCaret} width="65px" thStyle={{ width: '65px' }} dataFormat={(cell, row) => (
                        <FirebaseImage loadingIconSize="sm" alt={row.header} imageURL={cell} />
                      )}>Image</TableHeaderColumn>
                      <TableHeaderColumn isKey dataField="header" dataSort sortFunc={handleSort} caretRender={renderCaret}>Header</TableHeaderColumn>
                      <TableHeaderColumn dataField="contentAsText" dataSort sortFunc={handleSort} caretRender={renderCaret} width="400px" columnClassName="d-inline-block text-truncate" tdStyle={{
                        maxWidth: '400px'
                      }}>Content</TableHeaderColumn>
                      <TableHeaderColumn dataField="active" dataSort sortFunc={handleSort} caretRender={renderCaret} width="85px" dataFormat={(cell, row) => (
                        <StatusBadge
                          dbObjectName="Project"
                          dbId={row.pid}
                          dbIdName="pid"
                          dbActive={cell}
                          authUserUid={props.authUser.uid}
                          onSaveDbObject={props.firebase.saveDbProject}
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

export default withAuthorization(condition)(AuthProjectsView);
