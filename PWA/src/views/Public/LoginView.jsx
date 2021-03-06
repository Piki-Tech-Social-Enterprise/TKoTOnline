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

const LoginView = props => {
  const defaultDisplayTitle = 'Login Failed';
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
    if (!email || !password) {
      displayMessage = 'Email and Password are required fields.';
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      displayMessage = 'Email is invalid.';
    } else if (!password.match(/(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}/)) {
      displayMessage = 'Password is too weak. Needs to be 6 characters or more. It can be any combination of letters, numbers, and symbols (ASCII characters).';
    } else {
      try {
        setIsSubmitting(true);
        await props.firebase.signInWithEmailAndPassword(email, password);
        props.history.push('/auth');
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
          ? <Redirect to="/auth" />
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
                    Login
                  </Button>
                  <div className="pull-left">
                    <h6>
                      <a className="link" href="/public/Register">
                        Register?
                      </a>
                    </h6>
                  </div>
                  <div className="pull-right">
                    <h6 className="link">
                      <a className="link" href="/public/ForgotPassword">
                        Forgot Password?
                      </a>
                    </h6>
                  </div>
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
)(LoginView);
