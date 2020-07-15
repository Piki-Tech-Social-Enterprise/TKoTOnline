import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import NewsFeedCarousel from './NewsFeedCarousel';
import queryString from 'query-string';

const NewsFeedSection = props => {
  const {
    containerClassName,
    showLearnMoreButton
  } = props;
  const parsedQs = queryString.parse(window.location.search);
  const {
    c: searchCategory
  } = parsedQs;
  return (
    <Container className={`tkot-section ${containerClassName || ''}`}>
      <a id="NewsFeed" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col>
          <div className="mx-auto text-center">
            <h3 className="text-uppercase">Our Latest News{searchCategory ? `: ${searchCategory}` : null}</h3>
            <NewsFeedCarousel
              searchCategory={searchCategory}
            />
            {
              showLearnMoreButton
                ? <div className="mb-5 text-center">
                  <Button href="/NewsFeeds" outline color='dark' style={{
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

export default NewsFeedSection;
