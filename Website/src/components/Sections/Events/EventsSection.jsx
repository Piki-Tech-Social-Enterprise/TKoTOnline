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
  isDate,
  toMoment
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
const EventsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbEvents: []
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage,
    titleClassName
  } = props;
  const {
    isLoading,
    dbEvents
  } = state;
  useEffect(() => {
    const getEvents = async () => {
      const getDbEvents = async fieldName => {
        const dbEventsFieldNames = [
          'startDateTime',
          'endDateTime',
          'imageUrl',
          'header',
          'externalUrl',
          'evid'
        ];
        const dbEvents = await props.firebase.eventsRepository.getDbEventsAsArray(false, fieldName, true, NaN, dbEventsFieldNames);
        return dbEvents;
      };
      const {
        isHomePage,
        dbEvents: dbEventsPassedIn,
        doNotRetrieveData
      } = props;
      if (!doNotRetrieveData) {
        const dbEvents = dbEventsPassedIn
          ? dbEventsPassedIn
          : await getDbEvents(isHomePage
            ? 'isFeatured'
            : 'active');
        const now = new Date();
        setState(s => ({
          ...s,
          isLoading: false,
          dbEvents: dbEvents.filter(dbEvent => {
            const {
              startDateTime,
              endDateTime
            } = dbEvent;
            if (isDate(startDateTime)) {
              const startDateTimeAsMoment = toMoment(startDateTime);
              if (startDateTimeAsMoment.isAfter(now)) {
                return false;
              }
            }
            if (isDate(endDateTime)) {
              const endDateTimeAsMoment = toMoment(endDateTime);
              if (endDateTimeAsMoment.isBefore(now)) {
                return false;
              }
            }
            return true;
          })
        }));
      }
    };
    if (isLoading) {
      getEvents();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="Wananga" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className={`text-uppercase ${titleClassName || 'text-light'}`}>Te Tai Tokerau Events</h3>
            <Container className="my-3" fluid>
              <Row className={`cards-row ${isHomePage ? 'flex-row flex-nowrap' : ''}`}>
                {
                  isLoading
                    ? <LoadingSpinner caller="EventsSection" />
                    : dbEvents.length === 0
                      ? <NoDataToDisplayDiv name="Events" isHomePage={isHomePage} color={isHomePage ? 'light' : 'dark'} />
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
                                width="340"
                                lossless={true}
                                alt={header}
                                loadingIconSize="lg"
                                imageResize="md"
                              />
                              <CardBody className="bg-white">
                                <CardTitle className="h5 my-3 mx-2">{header}</CardTitle>
                                <Button
                                  href={externalUrl ? externalUrl : `/Wananga/${evid}`}
                                  target={externalUrl ? '_blank' : '_self'}
                                  rel={externalUrl ? 'noopener noreferrer' : 'alternate'}
                                  className="tkot-primary-red-bg-color"
                                  color="white"
                                  onClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} Wānanga page`, 'Clicked "Pānui Mai..." button', header, externalUrl ? externalUrl : `/Wananga/${evid}`)}
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
