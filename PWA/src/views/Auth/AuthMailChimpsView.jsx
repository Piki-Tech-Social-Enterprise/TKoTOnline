import React, {
    useState,
    useEffect
  } from 'react';
  import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button
  } from 'reactstrap';
  import {
    BootstrapTable,
    TableHeaderColumn,
    InsertButton
  } from 'react-bootstrap-table';
  import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
  import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
  import StatusBadge from 'components/App/StatusBadge';
  
  const AuthMailChimpsView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [MailChimpsAsArray, setMailChimpsAsArray] = useState([]);
    useEffect(() => {

        setIsLoading(false);
    }, [props, isLoading, setIsLoading, setMailChimpsAsArray]);
    const handleSortChange = async (sortName, sortOrder) => {
      MailChimpsAsArray.sort((a, b) => {
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

    
    const mailChimpData = async () => {
      console.log('her mail');
      const {
          firebase
        } = props;
        const functionsRepositoryOptions = {
          functionName: 'getCampaigns'
        };
        const result = await firebase.call(functionsRepositoryOptions);
        console.log(`${functionsRepositoryOptions.functionName}.result: ${JSON.stringify(result, null, 2)}`);
        return result.data;
  }
    const createCustomInsertButton = onClick => (
      <InsertButton btnText="Add New" onClick={() => handleAddCommunityLinksClick(onClick)} />
    );
    const handleAddCommunityLinksClick = async onClick => {
      props.history.push(`/auth/CommunityLinks/New`);
      onClick();
    };
    const handleCommunityLinksRowClick = async row => {
      props.history.push(`/auth/CommunityLinks/${row.clid}`);
    };
    const handleChildUpdate = updatedChildState => {
     
    }
    return (
      <>
        <div className="panel-header panel-header-xs" />
        <Container className="content">
          <Row>
            <Col>
              <Card>
              <Button onClick={() => mailChimpData()}>mailChimp</Button>
                <CardBody className="table-responsive">
                  {
                    isLoading
                      ? <LoadingOverlayModal color="text-info" />
                      : <BootstrapTable data={MailChimpsAsArray} version="4" bordered={false} condensed hover
                        trClassName="clickable"
                        tableHeaderClass="text-primary"
                        insertRow exportCSV csvFileName="mail-chimp-table-export"
                        search pagination options={{
                          defaultSortName: 'header',
                          hideSizePerPage: true,
                          noDataText: 'No Mail Chimp data',
                          onSortChange: handleSortChange,
                          insertBtn: createCustomInsertButton,
                          onRowClick: handleCommunityLinksRowClick
                        }}>
                        <TableHeaderColumn isKey dataField="linkName" dataSort>Link Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="link" dataSort>Link</TableHeaderColumn>
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
  
  export default withAuthorization(condition)(AuthMailChimpsView);
  