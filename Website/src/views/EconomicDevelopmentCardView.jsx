import React, {
  useEffect,
  useState
} from 'react';
import withRouter from 'react-router-dom/withRouter';
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
const EconomicDevelopmentCard = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/EconomicDevelopments/EconomicDevelopmentCard'));
const INITIAL_STATE = {
  isLoading: true,
  dbEconomicDevelopment: {
    header: '',
    imageURL: '',
    content: {},
    economicDevelopmentUrl: '',
    economicDevelopmentDownloadUrl: ''
  }
};
const EconomicDevelopmentCardView = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    dbEconomicDevelopment
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        dbEconomicDevelopment,
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
      const newEconomicDevelopment = getParams(search); // debugger;
      console.log(`retrieveData.newEconomicDevelopment: ${JSON.stringify(newEconomicDevelopment, null, 2)}`);
      setState(s => ({
        ...s,
        isLoading: false,
        dbEconomicDevelopment: dbEconomicDevelopment
          ? dbEconomicDevelopment
          : newEconomicDevelopment
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
          ? <LoadingSpinner caller="EconomicDevelopmentCardView" />
          : <>
            <Container>
              <Row noGutters>
                <Col>
                  <EconomicDevelopmentCard
                    dbEconomicDevelopment={dbEconomicDevelopment}
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

export default withRouter(EconomicDevelopmentCardView);
