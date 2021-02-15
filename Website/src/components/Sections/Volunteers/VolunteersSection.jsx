import React, {
  useState,
  useEffect
} from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Button
// } from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Button'));
const VolunteersSection = props => {
  const [volunteersDescription, setVolunteersDescription] = useState([]);
  useEffect(() => {
    const getSettings = async () => {
      const settings = await props.firebase.settingsRepository.getDbSettingsValues();
      return settings;
    };
    const getDescription = async () => {
      const getDescription = await getSettings();
      setVolunteersDescription(((getDescription && getDescription.volunteersDescription) || ''));
    };
    getDescription();
  }, [props])
  return (
    <Container id="Volunteers" className="tkot-section bg-secondary1">
      <Row>
        <Col>
          <h3>Volunteers</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{volunteersDescription}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button className="btn-round" color="primary" href="/Volunteer" size="lg">Join Now</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(VolunteersSection);
