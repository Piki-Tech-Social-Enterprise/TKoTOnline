import React, {
  useState,
  useEffect,
  lazy
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

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const FacebookLinksSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbFacebookLinks: []
  });
  const {
    containerClassName,
    showLearnMoreButton
  } = props;
  const {
    isLoading,
    dbFacebookLinks
  } = state;
  useEffect(() => {
    const getDbFacebookLinks = async () => {
      const {
        firebase
      } = props;
      const dbFacebookLinks = await firebase.getDbFacebookLinksAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbFacebookLinks
      }));
    };
    if (isLoading) {
      getDbFacebookLinks();
    }
  }, [props, isLoading]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="FacebookLinks" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">RSS (Web Feeds)</h3>
            {
              isLoading
                ? <LoadingSpinner />
                : <>
                  <Container className="my-3" fluid>
                    <Row className="cards-row">
                      {
                        dbFacebookLinks.map((dbFacebookLink, index) => {
                          const {
                            name,
                            url
                          } = dbFacebookLink;
                          return (
                            <Col xs={12} sm={6} lg={4} key={index}>
                              <iframe
                                allow="encrypted-media"
                                frameBorder="0"
                                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=timeline%2Cevents%2Cmessages&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                                style={{
                                  height: 400,
                                  width: '100%'
                                }}
                                title={name}
                              />
                            </Col>
                          );
                        })
                      }
                    </Row>
                  </Container>
                </>
            }
            {
              showLearnMoreButton
                ? <div className="mb-4 text-center">
                  <Button href="/FacebookLinks" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
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

export default withFirebase(FacebookLinksSection);
