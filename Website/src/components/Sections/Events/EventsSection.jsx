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
import Routes from 'components/Routes/routes';

const EventsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbEvents: []
  });
  const {
    containerClassName,
    showLearnMoreButton
  } = props;
  const {
    isLoading,
    dbEvents
  } = state;
  useEffect(() => {
    const getDbEvents = async () => {
      const {
        firebase
      } = props;
      const dbEvents = await firebase.getDbEventsAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbEvents
      }));
    };
    if (isLoading) {
      getDbEvents();
    }
  }, [props, isLoading, setState]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="Wananga" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row>
          <Col>
            <div className="mx-auto text-center">
              <h3 className="text-uppercase">Our Wānanga &amp; Events</h3>
              <Container className="my-3" fluid>
                <Row className="flex-row flex-nowrap cards-row">
                  {
                    isLoading
                      ? <LoadingSpinner />
                      : dbEvents.map((dbEvent, index) => {
                        return (
                          <Col xs={12} md={4} key={index}>
                            <Card className="card-block" style={{
                              border: 'none',
                              borderRadius: '0.25rem',
                              boxShadow: 'none'
                            }}>
                              <FirebaseImage className="card-img-max-height card-img-top" imageURL={dbEvent.imageUrl} alt={dbEvent.header} />
                              <CardBody className="bg-white">
                                <CardTitle className="h5 my-3 mx-2">{dbEvent.header}</CardTitle>
                                <CardLink href={`/Wananga/${dbEvent.evid}`} style={{
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
                    <Button href="/Wananga" outline color='dark' style={{
                      color: 'inherit'
                    }}>
                      View more...
                    </Button>
                    <a href={Routes.newsFeed} className="text-decoration-none text-dark">
                      <p className="my-0 mt-5"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
                    </a>
                  </div>
                  : null
              }
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFirebase(EventsSection);
