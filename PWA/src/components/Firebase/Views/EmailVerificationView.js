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
    <h3>{props.title}</h3><br />
    <h5>Check your emails (Spam/Junk folder included) for a confirmation email. {props.details}</h5>
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
    <div
      className="page-header"
      style={{
        marginTop: '0',
        paddingTop: "100px"
      }}
    >
      <Container>
        <Row>
          <Col className="mx-auto" md="8">
            <Card className="no-transition">
              <CardHeader>
                <h2>{process.env.REACT_APP_PWA_NAME} Email Verification</h2>
              </CardHeader>
              <CardBody>
                <ConfirmationSection title={title} details={details} />
                <Button type="button" block className="mt-4" color="link" onClick={handleSendConfirmationEmailClick} disabled={isSent}>
                  Send confirmation Email
                </Button>
                <CopyrightInfomation />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withFirebase(EmailVerificationView);
