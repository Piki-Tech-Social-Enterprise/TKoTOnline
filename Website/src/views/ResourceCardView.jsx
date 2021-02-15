import React, {
  useEffect,
  useState
} from 'react';
import withRouter from 'react-router-dom/es/withRouter';
// import {
//   Container,
//   Row,
//   Col
// } from 'reactstrap';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true */'components/App/LoadingSpinner'));
const ResourceCard = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Resources/ResourceCard'));
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
          ? <LoadingSpinner caller="ResourceCardView" />
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
