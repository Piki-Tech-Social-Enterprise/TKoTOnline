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
  draftToText
} from 'components/App/Utilities';

const NewsFeedSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbNewsFeeds: []
  });
  const {
    containerClassName,
    showLearnMoreButton
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
      setState(s => ({
        ...s,
        isLoading: false,
        dbNewsFeeds: searchCategory
          ? dbNewsFeeds.filter(dbnf => dbnf.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
          : dbNewsFeeds
      }));
    };
    if (isLoading) {
      getDbNewsFeeds();
    }
  }, [props, isLoading, setState, searchCategory]);
  return (
    <Container className={`tkot-section ${containerClassName || ''}`}>
      <a id="NewsFeed" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col>
          <div className="mx-auto text-center">
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
                          <Card className="card-block">
                            <CardHeader>
                              <CardTitle className="h5 my-3 mx-2">{header}</CardTitle>
                            </CardHeader>
                            <FirebaseImage className="card-img-max-height" imageURL={imageUrl} alt={header} />
                            <CardBody className="text-left bg-white">
                              <p className="font-weight-bold">
                                <NewsFeedCaption
                                  newsFeed={dbNewsFeed}
                                />
                              </p>
                              <p className="d-inline-block block-with-text">{contentAsText}</p>
                              <Button
                                href={externalUrl ? externalUrl : `/NewsFeeds/${nfid}`}
                                target={externalUrl ? '_blank' : '_self'}
                                rel={externalUrl ? 'noopener noreferrer' : 'alternate'}
                                className="tkot-primary-red-bg-color btn-outline-dark" color="white"
                              >
                                Read more...
                              </Button>
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
                  <Button href="/NewsFeeds" className="tkot-primary-red-bg-color btn-outline-dark" color="white">
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

export default withFirebase(NewsFeedSection);
