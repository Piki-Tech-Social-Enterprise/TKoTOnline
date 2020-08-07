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
  CardHeader
} from 'reactstrap';
// import NewsFeedCarousel from './NewsFeedCarousel';
import queryString from 'query-string';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';
import {
  withFirebase
} from 'components/Firebase';
import NewsFeedCaption from 'components/App/NewsFeedCaption';
import {
  draftToText,
  sortArray
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const NewsFeedSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbNewsFeeds: []
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
  } = props;
  const parsedQs = queryString.parse(window.location.search);
  const {
    c: searchCategory
  } = parsedQs;
  const {
    isLoading,
    dbNewsFeeds
  } = state;
  useEffect(() => {
    const getDbNewsFeeds = async () => {
      const {
        firebase
      } = props;
      const dbNewsFeeds = await firebase.getDbNewsFeedsAsArray();
      const filteredDbNewsFeeds = searchCategory
        ? dbNewsFeeds.filter(dbnf => dbnf.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
        : dbNewsFeeds;
      sortArray(filteredDbNewsFeeds, 'date', 'asc');
      setState(s => ({
        ...s,
        isLoading: false,
        dbNewsFeeds: filteredDbNewsFeeds
      }));
    };
    if (isLoading) {
      getDbNewsFeeds();
    }
  }, [props, isLoading, setState, searchCategory]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="NewsFeed" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Latest News{searchCategory ? `: ${searchCategory}` : null}</h3>
            {/* <NewsFeedCarousel
              searchCategory={searchCategory}
            /> */}
            <Container className="my-3" fluid>
              <Row className="flex-row flex-nowrap cards-row">
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbNewsFeeds.map((dbNewsFeed, index) => {
                      const {
                        content,
                        header,
                        imageUrl,
                        externalUrl,
                        nfid
                      } = dbNewsFeed;
                      const contentAsText = draftToText(content, '');
                      return (
                        <Col xs={12} sm={6} lg={4} key={index}>
                          <Card className="card-block news-feed-card">
                            <CardHeader>
                              <CardTitle className="h4 my-3 mx-2 font-weight-bold">{header}</CardTitle>
                            </CardHeader>
                            <FirebaseImage
                              className="card-img-max-height"
                              imageURL={imageUrl}
                              alt={header}
                              loadingIconSize="lg"
                            />
                            <CardBody className="text-left bg-white">
                              <p className="font-weight-bold">
                                <NewsFeedCaption
                                  newsFeed={dbNewsFeed}
                                />
                              </p>
                              <p className="d-inline-block block-with-text">{contentAsText}</p>
                              <div className="text-center">
                                <Button
                                  href={externalUrl ? externalUrl : `/NewsFeeds/${nfid}`}
                                  target={externalUrl ? '_blank' : '_self'}
                                  rel={externalUrl ? 'noopener noreferrer' : 'alternate'}
                                  className="tkot-primary-red-bg-color btn-outline-dark"
                                  color="white"
                                  onClick={() => sendEvent(`${isHomePage ? 'Home' : 'NewsFeeds'} page`, 'Clicked "Read More..." button', header, externalUrl ? externalUrl : `/NewsFeeds/${nfid}`)}
                                >Read more...</Button>
                              </div>
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
                  <Button href="/NewsFeeds" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
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

export default withFirebase(NewsFeedSection);
