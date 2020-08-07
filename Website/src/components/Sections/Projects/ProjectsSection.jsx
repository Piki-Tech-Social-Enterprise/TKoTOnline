import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';
import {
  withFirebase
} from 'components/Firebase';
// import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

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
    const getDbProjects = async () => {
      const {
        firebase
      } = props;
      const dbProjects = await firebase.getDbProjectsAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbProjects
      }));
    };
    if (isLoading) {
      getDbProjects();
    }
  }, [props, isLoading, setState]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="Projects" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Projects &amp; Initiatives</h3>
            <Container className="my-3" fluid>
              <Row className="flex-row flex-nowrap cards-row">
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbProjects.map((dbProject, index) => {
                      return (
                        <Col xs={12} sm={6} lg={4} key={index}>
                          <Card className="card-block" style={{
                            border: 'none',
                            boxShadow: 'none'
                          }}>
                            <FirebaseImage
                              className="card-img-max-height"
                              imageURL={dbProject.imageUrl}
                              alt={dbProject.header}
                              loadingIconSize="lg"
                            />
                            <CardBody className="bg-white text-dark">
                              <CardTitle className="h5 text-uppercase my-3 mx-2">{dbProject.header}</CardTitle>
                              <Button
                                href={`/Projects/${dbProject.pid}`}
                                className="tkot-primary-red-bg-color btn-outline-dark"
                                color="white"
                                onClick={() => sendEvent(`${isHomePage ? 'Home' : 'Projects'} page`, 'Clicked "Read More..." button', dbProject.header)}
                              >Read more...</Button>
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
