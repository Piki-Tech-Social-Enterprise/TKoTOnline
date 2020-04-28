import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';

const InteractiveMapSection = () => {
  return (
    <Container className="tkot-section" id="InteractiveMap">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning">
            <h3>Interactive Map of Iwi Links</h3>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default InteractiveMapSection;
