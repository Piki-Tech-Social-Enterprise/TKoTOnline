import React, {
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  Container,
} from 'reactstrap';
import SweetAlert from 'sweetalert2-react';

const ForgotPassword = props => {
  const defaultDisplayTitle = 'An email has been sent';
  // const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState(defaultDisplayTitle);
  const [show, setShow] = useState(false);
  const handleSubmit = async e => {
    let displayTitle = defaultDisplayTitle;
    let email = document.getElementById('Email').value;
    let displayMessage = '';
    e.preventDefault();
    if (!email) {
      displayTitle = 'Error';
      displayMessage = 'Email is a required field.';
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      displayTitle = 'Error';
      displayMessage = 'Email is invalid.';
    } else {
      console.log("firebase is ready to attach");
      displayMessage = 'Success';
      try {
        await props.firebase.sendPasswordResetEmail(email);
        console.log('anything');
      } catch (error) {
        displayMessage = error.message;
      }
    }
    if (displayMessage) {
      setSweetAlertStates(true, displayMessage, displayTitle, true);
    }
  };
  const setSweetAlertStates = (isSubmitting = false, text = '', title = '', show = false) => {
    setIsSubmitting(isSubmitting);
    setText(text);
    setTitle(title);
    setShow(show);
  };
  const {
    REACT_APP_PWA_NAME,
    REACT_APP_PWA_BUILD_VERSION
  } = process.env;
  return (
    <Container className="login-view text-center">
      <Card className="card-login card-plain">
        <CardHeader className="text-center">
          <div className="logo-container">
            <img alt={`${REACT_APP_PWA_NAME}`} src={require("assets/img/tkot/tkot-logo-512x512.png")} />
          </div>
          {REACT_APP_PWA_NAME} v{REACT_APP_PWA_BUILD_VERSION}
        </CardHeader>
        <CardBody className="pb-0">
          <p>Reset your password</p>
          <Form className="register-form" onSubmit={handleSubmit} noValidate>
            <Input id="Email" placeholder="Email" type="text" />
            <Button
              block
              className="btn-round my-2"
              color="danger"
              size="lg"
              type="submit"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              block
              className="btn-round my-2"
              color="secondary"
              size="lg"
              type="button"
              disabled={isSubmitting}
              href="/public/Login"
            >
              Back
            </Button>
            <SweetAlert
              show={show}
              title={title}
              text={text}
              onConfirm={() => setSweetAlertStates()} />
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default withFirebase(ForgotPassword);