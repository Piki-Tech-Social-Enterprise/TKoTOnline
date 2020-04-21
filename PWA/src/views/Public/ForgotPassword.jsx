import React, {
  useState
} from 'react';
import {
  AuthUserContext,
  withFirebase
} from 'components/Firebase';
import {
  compose
} from 'recompose';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {
  Card,
  Form,
  CardHeader,
  CardBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  CardFooter,
  Button
} from 'reactstrap';
import SweetAlert from 'sweetalert2-react';

const ForgotPassword = props => {
  const defaultDisplayTitle = 'Password Recovery Failed';
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState(defaultDisplayTitle);
  const [show, setShow] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    let displayTitle = defaultDisplayTitle;
    let displayMessage = '';
    if (!email) {
      displayMessage = 'Email is a required field.';
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      displayMessage = 'Email is invalid.';
    } else {
      try {
        setIsSubmitting(true);
        await props.firebase.sendPasswordResetEmail(email);
        props.history.push('/public/Login');
        setIsSubmitting(false);
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
    <AuthUserContext.Consumer>
      {authUser =>
        authUser && !!authUser.active
          ? <Redirect to="/public/Login" />
          : <div className="login-view text-center">
            <Card className="card-login card-plain">
              <Form className="form" onSubmit={handleSubmit} noValidate>
                <CardHeader className="text-center">
                  <div className="logo-container">
                    <img alt={`${REACT_APP_PWA_NAME}`} src={require("assets/img/tkot/tkot-logo-512x512.png")} />
                  </div>
                  {REACT_APP_PWA_NAME} v{REACT_APP_PWA_BUILD_VERSION}
                </CardHeader>
                <CardBody className="pb-0">
                  <InputGroup className={`no-border input-lg${(firstFocus && ' input-group-focus') || ''}`}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="text-white now-ui-icons ui-1_email-85"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      onFocus={() => setFirstFocus(true)}
                      onBlur={() => setFirstFocus(false)}
                      value={email}
                      onChange={async e => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    ></Input>
                  </InputGroup>
                  <InputGroup className={`no-border input-lg${(lastFocus && ' input-group-focus') || ''}`}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_lock-circle-open"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      onFocus={() => setLastFocus(true)}
                      onBlur={() => setLastFocus(false)}
                      value={password}
                      onChange={async e => setPassword(e.target.value)}
                      disabled={isSubmitting}
                    ></Input>
                  </InputGroup>
                </CardBody>
                <CardFooter className="text-center pt-0">
                  <Button
                    block
                    className="btn-round my-2"
                    color="primary"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Reset Password
                  </Button>
                </CardFooter>
                <SweetAlert show={show} title={title} text={text} onConfirm={() => setSweetAlertStates()} />
              </Form>
            </Card>
          </div>
      }
    </AuthUserContext.Consumer>
  );
};

export default compose(
  withRouter,
  withFirebase
)(ForgotPassword);
