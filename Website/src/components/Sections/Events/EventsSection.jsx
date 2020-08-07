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

const EventsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbEvents: []
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
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
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase text-light">Te Tai Tokerau Events</h3>
            <Container className="my-3" fluid>
              <Row className="flex-row flex-nowrap cards-row">
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbEvents.map((dbEvent, index) => {
                      const {
                        imageUrl,
                        header,
                        externalUrl,
                        evid
                      } = dbEvent;
                      return (
                        <Col xs={12} sm={6} lg={4} key={index}>
                          <Card className="card-block event-card">
                            <FirebaseImage
                              className="card-img-max-height card-img-top"
                              imageURL={imageUrl}
                              alt={header}
                              loadingIconSize="lg"
                            />
                            <CardBody className="bg-white">
                              <CardTitle className="h5 my-3 mx-2">{header}</CardTitle>
                              <Button
                                href={externalUrl ? externalUrl : `/Wananga/${evid}`}
                                target={externalUrl ? '_blank' : '_self'}
                                rel={externalUrl ? 'noopener noreferrer' : 'alternate'}
                                className="tkot-primary-red-bg-color"
                                color="white"
                                onClick={() => sendEvent(`${isHomePage ? 'Home' : 'Wānanga'} page`, 'Clicked "Read More..." button', header, externalUrl ? externalUrl : `/Wananga/${evid}`)}
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
                  <Button href="/Wananga" className="text-light" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
                    View more...
                    </Button>
                  {/* <a href={Routes.newsFeed} className="text-decoration-none text-light">
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

export default withFirebase(EventsSection);
