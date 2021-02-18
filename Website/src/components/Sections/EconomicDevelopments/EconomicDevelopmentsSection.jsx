import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
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
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
const EconomicDevelopmentCard = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-economic-development-card' */'components/Sections/EconomicDevelopments/EconomicDevelopmentCard'));
const EconomicDevelopmentsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbCategorisedEconomicDevelopments: {}
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage,
    showViewTaitokerauEconomicSummit2020SiteButton
  } = props;
  const {
    isLoading,
    dbCategorisedEconomicDevelopments
  } = state;
  const dbCategorisedEconomicDevelopmentsAsArray = Object.keys(dbCategorisedEconomicDevelopments);
  sortArray(dbCategorisedEconomicDevelopmentsAsArray, null, 'asc');
  useEffect(() => {
    const getEconomicDevelopments = async () => {
      const getDbEconomicDevelopments = async fieldName => {
        const dbEconomicDevelopmentsFieldNames = [
          'category',
          'header',
          'imageUrl',
          'content',
          'economicDevelopmentUrl',
          'economicDevelopmentDownloadUrl'
        ];
        const dbEconomicDevelopments = await props.firebase.economicDevelopmentsRepository.getDbEconomicDevelopmentsAsArray(false, fieldName, true, NaN, dbEconomicDevelopmentsFieldNames);
        return dbEconomicDevelopments;
      };
      const {
        isHomePage,
        isFeatured,
        dbEconomicDevelopments: dbEconomicDevelopmentsPassedIn
      } = props;
      const dbEconomicDevelopments = dbEconomicDevelopmentsPassedIn
        ? dbEconomicDevelopmentsPassedIn
        : await getDbEconomicDevelopments(isHomePage || isFeatured
          ? 'isFeatured'
          : 'active');
      const dbCategorisedEconomicDevelopments = {};
      await Promise.all(dbEconomicDevelopments.map(async dbEconomicDevelopment => {
        const {
          economicDevelopmentUrl,
          category
        } = dbEconomicDevelopment;
        const dbCategorisedEconomicDevelopment = (dbCategorisedEconomicDevelopments[category] || []);
        dbEconomicDevelopment.economicDevelopmentDownloadUrl = economicDevelopmentUrl.startsWith('/economicDevelopments')
          ? await props.firebase.storageRepository.getStorageFileDownloadURL(economicDevelopmentUrl)
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
      getEconomicDevelopments();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="EconomicDevelopments" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Economic Development</h3>
            {
              isLoading
                ? <LoadingSpinner caller="EconomicDevelopmentsSection" />
                : <>
                  {
                    dbCategorisedEconomicDevelopmentsAsArray.length === 0
                      ? <NoDataToDisplayDiv name="Economic Development" isHomePage={isHomePage} />
                      : isHomePage
                        ? <>
                          <Container className="my-3" fluid>
                            <Row className="cards-row flex-row flex-nowrap" noGutters>
                              {
                                dbCategorisedEconomicDevelopmentsAsArray.map(dbCategorisedEconomicDevelopmentsKey => {
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
                              }
                            </Row>
                          </Container>
                        </>
                        : <>
                          {
                            dbCategorisedEconomicDevelopmentsAsArray.map(dbCategorisedEconomicDevelopmentKey => {
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
                          }
                        </>
                  }
                </>
            }
            {
              showLearnMoreButton
                ? <div className="mb-4x text-center">
                  <Button
                    href="/EconomicDevelopments"
                    className="text-dark"
                    color="link"
                    size="lg"
                    onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}
                  >View more...</Button>
                </div>
                : null
            }
            {
              showViewTaitokerauEconomicSummit2020SiteButton
                ? <div className="mb-4 text-center">
                  <Button
                    href="http://tautokoeconomy.maori.nz/summit-main/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tkot-primary-red-bg-color btn-outline-dark"
                    color="white"
                    size="lg"
                    onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}
                  >View Taitokerau Economic Summit 2020 Site</Button>
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
