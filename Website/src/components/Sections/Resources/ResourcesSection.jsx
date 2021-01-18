import React, {
  useState,
  useEffect,
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
import {
  lazy
} from 'react-lazy-no-flicker';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import('components/App/NoDataToDisplayDiv'));
const ResourceCard = lazy(async () => await import('components/Sections/Resources/ResourceCard'));
const ResourcesSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbCategorisedResources: {}
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
  } = props;
  const {
    isLoading,
    dbCategorisedResources
  } = state;
  const dbCategorisedResourcesAsArray = Object.keys(dbCategorisedResources);
  sortArray(dbCategorisedResourcesAsArray, null, 'asc');
  useEffect(() => {
    const getDbResources = async () => {
      const {
        firebase,
        isHomePage
      } = props; // debugger;
      const dbResources = isHomePage
        ? await firebase.getDbResourcesAsArray(false, 'isFeatured')
        : await firebase.getDbResourcesAsArray();
      const dbCategorisedResources = {};
      await Promise.all(dbResources.map(async dbResource => {
        const {
          resourceUrl,
          category
        } = dbResource;
        const dbCategorisedResource = (dbCategorisedResources[category] || []);
        dbResource.resourceDownloadUrl = resourceUrl.startsWith('/resources')
          ? await firebase.getStorageFileDownloadURL(resourceUrl)
          : resourceUrl;
        dbCategorisedResource.push(dbResource);
        dbCategorisedResources[category] = dbCategorisedResource;
        return null;
      }));
      setState(s => ({
        ...s,
        isLoading: false,
        dbCategorisedResources
      }));
    };
    if (isLoading) {
      getDbResources();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="Resources" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Resources &amp; Downloads</h3>
            {
              isLoading
                ? <LoadingSpinner />
                : <>
                  {
                    dbCategorisedResourcesAsArray.length === 0
                      ? <NoDataToDisplayDiv name="Resources" isHomePage={isHomePage} />
                      : isHomePage
                        ? <>
                          <Container className="my-3" fluid>
                            <Row className="cards-row flex-row flex-nowrap" noGutters>
                              {
                                dbCategorisedResourcesAsArray.map(dbCategorisedResourcesKey => {
                                  const categorisedResources = dbCategorisedResources[dbCategorisedResourcesKey];
                                  return (
                                    <Col xs={12} sm={4} key={dbCategorisedResourcesKey}>
                                      <h3
                                        className="text-uppercase font-weight-bold categorised-resource-header clickable header-with-text"
                                        onClick={async e => await handleBlockTextClick(e, 'h3.categorised-resource-header', 'header-with-text')}
                                      >{dbCategorisedResourcesKey}</h3>
                                      {
                                        categorisedResources.map((dbResource, index) => (
                                          <Col key={index}>
                                            <ResourceCard
                                              dbResource={dbResource}
                                              onButtonClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} Resources page`, 'Clicked "Pā Mai" button', dbResource.header)}
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
                            dbCategorisedResourcesAsArray.map(dbCategorisedResourceKey => {
                              const dbCategorisedResource = dbCategorisedResources[dbCategorisedResourceKey];
                              return (
                                <Fragment key={dbCategorisedResourceKey}>
                                  <h4 className="text-uppercase h3 font-weight-bold">{dbCategorisedResourceKey}</h4>
                                  <Container className="my-3" fluid>
                                    <Row className="cards-row flex-row flex-nowrap">
                                      {
                                        dbCategorisedResource.map((dbResource, index) => (
                                          <Col xs={12} sm={6} lg={4} key={index}>
                                            <ResourceCard
                                              dbResource={dbResource}
                                              onButtonClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} Resources page`, 'Clicked "Pā Mai" button', dbResource.header)}
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
                ? <div className="mb-4 text-center">
                  <Button href="/Resources" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
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

export default withFirebase(ResourcesSection);
