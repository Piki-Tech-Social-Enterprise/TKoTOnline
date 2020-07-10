import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import NewsFeedCarousel from './NewsFeedCarousel';

const NewsFeedSection = props => {
  const {
    containerClassName,
    showLearnMoreButton
  } = props;
  return (
    <Container className={`tkot-section ${containerClassName || ''}`}>
      <a id="NewsFeed" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col>
          <div className="mx-auto text-uppercase text-center">
            <h3>Our Latest News</h3>
            <NewsFeedCarousel />
            {
              showLearnMoreButton
                ? <div className="mb-5 text-center">
                  <Button href="/NewsFeeds" outline color='dark' style={{
                    color: 'inherit'
                  }}>
                    Learn more...
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
