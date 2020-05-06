import React from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';

const VolunteersSection = () => {

  return (
    <Container className="tkot-section">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning" id="Volunteer">
            <h3>Volunteers</h3>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mx-auto text-left">
              <p>
              s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing 
              </p>
          </div>
        </Col>
        <Col>
          <div className="mx-auto text-left">
            <p>
            s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
          className="btn-round"
          color="default"
          href="/Volunteer"
          size="lg">Join Now</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VolunteersSection;
