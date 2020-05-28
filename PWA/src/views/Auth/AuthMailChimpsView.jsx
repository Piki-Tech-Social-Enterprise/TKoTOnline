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
    TableHeaderColumn
  } from 'react-bootstrap-table';
  import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
  import withAuthorization from 'components/Firebase/HighOrder/withAuthorization';
  
  const AuthMailChimpsView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [MailChimpsAsArray, setMailChimpsAsArray] = useState([]);
    useEffect(() => {
      const retrieveMailChimpData = async () => {
        const dbCampaignsAsArray = await mailChimpData();
        setMailChimpsAsArray(dbCampaignsAsArray);
        setIsLoading(false);
      };

      if (isLoading) {
        retrieveMailChimpData();
      }
      return () => {
        if (isLoading) {
          setIsLoading(false);
        }
      };
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
                      : <BootstrapTable data={MailChimpsAsArray} version="4" bordered={false} condensed hover
                        tableHeaderClass="text-primary"
                        search pagination options={{
                          defaultSortName: 'header',
                          hideSizePerPage: true,
                          noDataText: 'No Mail Chimp data',
                          onSortChange: handleSortChange
                        }}>
                        <TableHeaderColumn isKey dataField="title" width="25%" dataSort>Title</TableHeaderColumn>
                        <TableHeaderColumn dataField="url" dataSort>Url</TableHeaderColumn>
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
  