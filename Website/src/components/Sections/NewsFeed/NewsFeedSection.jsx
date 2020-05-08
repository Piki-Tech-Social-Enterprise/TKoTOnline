import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import NewsFeedCarousel from './NewsFeedCarousel';

const NewsFeedSection = () => {
  return (
    <Container className="tkot-section bg-danger1" id="NewsFeed">
      <Row>
        <Col>
          <div className="mx-auto text-center">
            <h3>Live News Feeds/Updates</h3>
            <NewsFeedCarousel />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsFeedSection;
