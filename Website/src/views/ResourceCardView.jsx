import React, {
  useEffect,
  useState,
  lazy
} from 'react';
import {
  withRouter
} from 'react-router-dom';
import {
  Container,
  Row,
  Col
} from 'reactstrap';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const ResourceCard = lazy(async () => await import('components/Sections/Resources/ResourceCard'));
const INITIAL_STATE = {
  isLoading: true,
  dbResource: {
    header: '',
    imageURL: '',
    content: {},
    resourceUrl: '',
    resourceDownloadUrl: ''
  }
};
const ResourceCardView = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    dbResource
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        dbResource,
        location
      } = props;
      const {
        search
      } = location;
      const getParams = searchValue => {
        let params = {};
        searchValue = searchValue.startsWith('?')
          ? searchValue.substring(1)
          : searchValue;
        const searchValueParts = searchValue.split('&');
        searchValueParts.map(searchValuePart => {
          const keyValueParts = searchValuePart.split('=');
          params[keyValueParts[0]] = decodeURIComponent(keyValueParts[1]);
          return null;
        });
        return params;
      };
      const newResource = getParams(search); // debugger;
      // console.log(`retrieveData.newResource: ${JSON.stringify(newResource, null, 2)}`);
      setState(s => ({
        ...s,
        isLoading: false,
        dbResource: dbResource
          ? dbResource
          : newResource
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => { };
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <LoadingSpinner />
          : <>
            <Container>
              <Row noGutters>
                <Col>
                  <ResourceCard
                    dbResource={dbResource}
                    onButtonClick={() => { }}
                  />
                </Col>
              </Row>
            </Container>
          </>
      }
    </>
  );
};

export default withRouter(ResourceCardView);
