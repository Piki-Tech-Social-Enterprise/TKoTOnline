import React from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';

const VolunteersSection = () => {
  return (
    <Container className="tkot-section">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning">
            <h3>Volunteers</h3>
          </div>
        </Col>
      </Row>
    </Container >
  );
};

export default VolunteersSection;
