import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import NewsFeedCarousel from './NewsFeedCarousel';

const NewsFeedSection = () => {
  return (
    <Container className="tkot-section"  id="NewsFeed">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning">
            <h3>Live News Feeds/Updates</h3>
            <NewsFeedCarousel />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsFeedSection;
