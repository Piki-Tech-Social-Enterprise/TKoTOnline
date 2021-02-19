import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
// import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  handleBlockTextClick
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const Card = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-card' */'reactstrap/es/Card'));
const CardBody = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardbody' */'reactstrap/es/CardBody'));
const CardTitle = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardtitle' */'reactstrap/es/CardTitle'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
const ProjectsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbProjects: []
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
  } = props;
  const {
    isLoading,
    dbProjects
  } = state;
  useEffect(() => {
    const getProjects = async () => {
      const getDbProjects = async fieldName => {
        const dbProjectsFieldNames = [
          'header',
          'imageUrl',
          'pid'
        ];
        const dbProjects = await props.firebase.projectsRepository.getDbProjectsAsArray(false, fieldName, true, NaN, dbProjectsFieldNames);
        return dbProjects;
      };
      const {
        isHomePage,
        dbProjects: dbProjectsPassedIn,
        doNotRetrieveData
      } = props;
      if (!doNotRetrieveData) {
        const dbProjects = dbProjectsPassedIn
          ? dbProjectsPassedIn
          : await getDbProjects(isHomePage
            ? 'isFeatured'
            : 'active');
        setState(s => ({
          ...s,
          isLoading: false,
          dbProjects
        }));
      };
    }
    if (isLoading) {
      getProjects();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="Projects" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Projects &amp; Initiatives</h3>
            <Container className="my-3" fluid>
              <Row className={`cards-row ${isHomePage ? 'flex-row flex-nowrap' : ''}`}>
                {
                  isLoading
                    ? <LoadingSpinner caller="ProjectsSection" />
                    : dbProjects.length === 0
                      ? <NoDataToDisplayDiv name="Projects" isHomePage={isHomePage} />
                      : dbProjects.map((dbProject, index) => {
                        const {
                          header,
                          imageUrl,
                          pid
                        } = dbProject;
                        return (
                          <Col xs={12} sm={6} lg={4} key={index}>
                            <Card className="card-block">
                              <FirebaseImage
                                className="card-img-max-height"
                                imageURL={imageUrl}
                                width="340"
                                lossless={true}
                                alt={header}
                                loadingIconSize="lg"
                                imageResize="md"
                              />
                              <CardBody className="bg-white text-dark">
                                <CardTitle
                                  className="h5 text-uppercase my-3 mx-2 project-header clickable header-with-text"
                                  onClick={async e => await handleBlockTextClick(e, 'div.project-header', 'header-with-text')}
                                >{header}&nbsp;</CardTitle>
                                <Button
                                  href={`/Projects/${pid}`}
                                  className="tkot-primary-red-bg-color btn-outline-dark"
                                  color="white"
                                  onClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} Projects page`, 'Clicked "Pānui Mai..." button', header)}
                                >Pānui Mai...</Button>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })
                }
              </Row>
            </Container>
            {
              showLearnMoreButton
                ? <div className="mb-4 text-center">
                  <Button href="/Projects" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
                    View more...
                  </Button>
                  {/* <a href={Routes.events} className="text-decoration-none text-dark">
                    <p className="my-0 mt-5"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
                  </a> */}
                </div>
                : null
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFirebase(ProjectsSection);
