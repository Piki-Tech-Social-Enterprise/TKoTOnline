import React, {
  useState
} from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from 'reactstrap';
import {
  withFirebase
} from '../Contexts/firebaseContext';
import CopyrightInfomation from '../../App/CopyrightInfomation';

const ConfirmationSection = props => (
  <>
    <h3>{props.title}</h3>
    <h5><b className="text-success">Check your emails</b> <i className="text-warning">(Spam/Junk folder included)</i> for a confirmation email. {props.details}</h5>
  </>
);
const EmailVerificationView = props => {
  const [isSent, setIsSent] = useState(false);
  const [title, setTitle] = useState('Verify your email');
  const [details, setDetails] = useState('Or send another confirmation email.');
  const handleSendConfirmationEmailClick = async () => {
    await props.firebase
      .sendEmailVerification()
      .then(() => {
        setTitle('Confirmation Sent');
        setDetails('Refresh this page once you confirmed your email.');
        setIsSent(true);
      });
  };
  return (
    <>
      <img
        src={require('assets/img/tkot/Te-Takarangi-hero-2-80pct.jpg')}
        alt="Fullscreen Background Image"
        className="fullscreen-background-image"
      />
      <Container className="mt-3 pt-5 text-light">
        <Row>
          <Col className="mx-auto" md="8">
            <Card className="no-transition bg-panel px-5 py-3">
              <CardHeader>
                <h2>{process.env.REACT_APP_PWA_NAME} Email Verification</h2>
              </CardHeader>
              <CardBody>
                <ConfirmationSection title={title} details={details} />
                <Button onClick={handleSendConfirmationEmailClick} disabled={isSent} type="button" className="mt-3" color="link">
                  Re-send Confirmation Email
                </Button>
                <CopyrightInfomation />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withFirebase(EmailVerificationView);
