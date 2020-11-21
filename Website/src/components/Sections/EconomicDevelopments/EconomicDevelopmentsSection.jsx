import React, {
  useState,
  useEffect,
  lazy,
  Fragment
} from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  sortArray,
  handleBlockTextClick
} from 'components/App/Utilities';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const EconomicDevelopmentCard = lazy(async () => await import('components/Sections/EconomicDevelopments/EconomicDevelopmentCard'));
const EconomicDevelopmentsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbCategorisedEconomicDevelopments: {}
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
  } = props;
  const {
    isLoading,
    dbCategorisedEconomicDevelopments
  } = state;
  const dbCategorisedEconomicDevelopmentsAsArray = Object.keys(dbCategorisedEconomicDevelopments);
  sortArray(dbCategorisedEconomicDevelopmentsAsArray, null, 'asc');
  useEffect(() => {
    const getDbEconomicDevelopments = async () => {
      const {
        firebase,
        isHomePage
      } = props; // debugger;
      const dbEconomicDevelopments = isHomePage
        ? await firebase.getDbEconomicDevelopmentsAsArray(false, 'isFeatured')
        : await firebase.getDbEconomicDevelopmentsAsArray();
      const dbCategorisedEconomicDevelopments = {};
      await Promise.all(dbEconomicDevelopments.map(async dbEconomicDevelopment => {
        const {
          economicDevelopmentUrl,
          category
        } = dbEconomicDevelopment;
        const dbCategorisedEconomicDevelopment = (dbCategorisedEconomicDevelopments[category] || []);
        dbEconomicDevelopment.economicDevelopmentDownloadUrl = economicDevelopmentUrl.startsWith('/economicDevelopments')
          ? await firebase.getStorageFileDownloadURL(economicDevelopmentUrl)
          : economicDevelopmentUrl;
        dbCategorisedEconomicDevelopment.push(dbEconomicDevelopment);
        dbCategorisedEconomicDevelopments[category] = dbCategorisedEconomicDevelopment;
        return null;
      }));
      setState(s => ({
        ...s,
        isLoading: false,
        dbCategorisedEconomicDevelopments
      }));
    };
    if (isLoading) {
      getDbEconomicDevelopments();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="EconomicDevelopments" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Economic Development</h3>
            {
              isLoading
                ? <LoadingSpinner />
                : <>
                  {
                    isHomePage
                      ? <>
                        <Container className="my-3" fluid>
                          <Row className="cards-row flex-row flex-nowrap" noGutters>
                            {
                              dbCategorisedEconomicDevelopmentsAsArray && dbCategorisedEconomicDevelopmentsAsArray.length > 0
                                ? dbCategorisedEconomicDevelopmentsAsArray.map(dbCategorisedEconomicDevelopmentsKey => {
                                  const categorisedEconomicDevelopments = dbCategorisedEconomicDevelopments[dbCategorisedEconomicDevelopmentsKey];
                                  return (
                                    <Col xs={12} sm={4} key={dbCategorisedEconomicDevelopmentsKey}>
                                      <h3
                                        className="text-uppercase font-weight-bold categorised-economicDevelopment-header clickable header-with-text"
                                        onClick={async e => await handleBlockTextClick(e, 'h3.categorised-economicDevelopment-header', 'header-with-text')}
                                      >{dbCategorisedEconomicDevelopmentsKey}</h3>
                                      {
                                        categorisedEconomicDevelopments.map((dbEconomicDevelopment, index) => (
                                          <Col key={index}>
                                            <EconomicDevelopmentCard
                                              dbEconomicDevelopment={dbEconomicDevelopment}
                                              onButtonClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} EconomicDevelopments page`, 'Clicked "Pā Mai" button', dbEconomicDevelopment.header)}
                                            />
                                          </Col>
                                        ))
                                      }
                                    </Col>
                                  );
                                })
                                : <h4>No EconomicDevelopments found</h4>
                            }
                          </Row>
                        </Container>
                      </>
                      : <>
                        {
                          dbCategorisedEconomicDevelopmentsAsArray && dbCategorisedEconomicDevelopmentsAsArray.length > 0
                            ? dbCategorisedEconomicDevelopmentsAsArray.map(dbCategorisedEconomicDevelopmentKey => {
                              const dbCategorisedEconomicDevelopment = dbCategorisedEconomicDevelopments[dbCategorisedEconomicDevelopmentKey];
                              return (
                                <Fragment key={dbCategorisedEconomicDevelopmentKey}>
                                  <h4 className="text-uppercase h3 font-weight-bold">{dbCategorisedEconomicDevelopmentKey}</h4>
                                  <Container className="my-3" fluid>
                                    <Row className="cards-row flex-row flex-nowrap">
                                      {
                                        dbCategorisedEconomicDevelopment.map((dbEconomicDevelopment, index) => (
                                          <Col xs={12} sm={6} lg={4} key={index}>
                                            <EconomicDevelopmentCard
                                              dbEconomicDevelopment={dbEconomicDevelopment}
                                              onButtonClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} EconomicDevelopments page`, 'Clicked "Pā Mai" button', dbEconomicDevelopment.header)}
                                            />
                                          </Col>
                                        ))
                                      }
                                    </Row>
                                  </Container>
                                </Fragment>
                              );
                            })
                            : <h4>No EconomicDevelopments found</h4>
                        }
                      </>
                  }
                </>
            }
            {
              showLearnMoreButton
                ? <div className="mb-4 text-center">
                  <Button href="/EconomicDevelopments" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
                    View more...
                  </Button>
                </div>
                : null
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFirebase(EconomicDevelopmentsSection);