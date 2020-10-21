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
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import draftToHtml from 'draftjs-to-html';
import {
  sortArray
} from 'components/App/Utilities';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
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
        firebase
      } = props;
      const dbResources = await firebase.getDbResourcesAsArray();
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
        <a id="Resources" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Resources &amp; Downloads</h3>
            {
              isLoading
                ? <LoadingSpinner />
                : <>
                  {
                    dbCategorisedResourcesAsArray && dbCategorisedResourcesAsArray.length > 0
                      ? dbCategorisedResourcesAsArray.map(dbCategorisedResourceKey => {
                        const dbCategorisedResource = dbCategorisedResources[dbCategorisedResourceKey];
                        return (
                          <Fragment key={dbCategorisedResourceKey}>
                            <h4 className="text-uppercase">{dbCategorisedResourceKey}</h4>
                            <Container className="my-3" fluid>
                              <Row className="cards-row flex-row flex-nowrap">
                                {
                                  dbCategorisedResource.map((dbResource, index) => (
                                    <Col xs={12} sm={6} lg={4} key={index}>
                                      <Card className="card-block resource-card">
                                        <CardHeader>
                                          <CardTitle className="h5 text-uppercase my-3 mx-2">{dbResource.header}</CardTitle>
                                        </CardHeader>
                                        <CardBody className="bg-white text-dark text-left">
                                          <div
                                            className="resource-content clickable block-with-text"
                                            dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(dbResource.content)) }}
                                            onClick={async e => {
                                              e.preventDefault();
                                              e.target.closest('div.resource-content').classList.toggle('block-with-text');
                                            }}
                                          />
                                          <div className="text-center mt-3">
                                            <Button
                                              download={dbResource.resourceUrl.split('/').pop()}
                                              href={dbResource.resourceDownloadUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="tkot-primary-red-bg-color btn-outline-dark"
                                              color="white"
                                              onClick={() => sendEvent(`${isHomePage ? 'Home' : 'Resources'} page`, 'Clicked "Click Here" button', dbResource.header)}
                                            >Click Here</Button>
                                          </div>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  ))
                                }
                              </Row>
                            </Container>
                          </Fragment>
                        );
                      })
                      : <h4>No Resources found</h4>
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
