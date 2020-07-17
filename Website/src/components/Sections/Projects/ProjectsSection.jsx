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
  CardTitle,
  CardLink
} from 'reactstrap';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';
import {
  withFirebase
} from 'components/Firebase';

const ProjectsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbProjects: []
  });
  const {
    containerClassName,
    showLearnMoreButton
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
    <Container className={`tkot-section ${containerClassName || ''}`}>
      <a id="Projects" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col>
          <div className="mx-auto text-center">
            <h3 className="text-uppercase">Our Projects &amp; Initiatives</h3>
            <Container className="my-3" fluid>
              <Row className="flex-row flex-nowrap cards-row">
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbProjects.map((dbProject, index) => {
                      return (
                        <Col xs={12} md={4} key={index}>
                          <Card className="card-block" style={{
                            border: 'none',
                            boxShadow: 'none'
                          }}>
                            <FirebaseImage className="card-img-max-height" imageURL={dbProject.imageUrl} alt={dbProject.header} />
                            <CardBody className="bg-white">
                              <CardTitle className="h5 my-3 mx-2">{dbProject.header}</CardTitle>
                              <CardLink href={`/Projects/${dbProject.pid}`} style={{
                                color: 'inherit'
                              }}>Read more...</CardLink>
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
                ? <div className="mb-5 text-center">
                  <Button href="/Projects" outline color='dark' style={{
                    color: 'inherit'
                  }}>
                    View more...
                </Button>
                </div>
                : null
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(ProjectsSection);
