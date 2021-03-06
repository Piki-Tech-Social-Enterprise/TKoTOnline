import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  sortArray
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';


const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
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
      const dbFacebookLinks = await firebase.facebookLinkRepository.getDbFacebookLinksAsArray();
      sortArray(dbFacebookLinks, 'sequence', 'desc');
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
        <a id="FacebookLinks" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">FB Feeds</h3>
            {
              isLoading
                ? <LoadingSpinner caller="FacebookLinksSection" />
                : <>
                  <Container className="my-3" fluid>
                    <Row className="cards-row">
                      {
                        dbFacebookLinks.length === 0
                          ? <NoDataToDisplayDiv name="FB Feeds" />
                          : dbFacebookLinks.map((dbFacebookLink, index) => {
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
                                  className="fb-feed-iframe"
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
