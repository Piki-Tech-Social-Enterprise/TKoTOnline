import React, {useState, useEffect} from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';

const VolunteersSection = (props) => {

  const [volunteersDescription, setDescription] = useState([]);

  useEffect(() => {

    const getSettings = async () =>{
      const settings = await props.firebase.getDbSettingsValues(true);
      return settings;
    }

    const getDescription = async () => {
      const getDescription = await getSettings();
      setDescription(getDescription.volunteersDescritpion);
    }

    getDescription();
  }, [props])

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
              <p>{volunteersDescription}</p>
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

export default withFirebase(VolunteersSection);
