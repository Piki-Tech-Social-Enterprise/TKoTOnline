import React, {
  useState
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  withFirebase
} from 'components/Firebase';
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
import {
  basicRole
} from 'components/Domains/Roles';

const RegisterView = props => {
  const defaultDisplayTitle = 'Registration Failed';
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState(defaultDisplayTitle);
  const [show, setShow] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    let displayTitle = defaultDisplayTitle;
    let displayMessage = '';
    if (!email || !confirmEmail || !password || !confirmPassword || !displayName) {
      displayMessage = 'Email, Confirmed Email, Password, Confirmed Password, and Display Name are required fields.';
    } else if (email !== confirmEmail) {
      displayMessage = 'Email and Confirmed Email fields do not match.';
    } else if (password !== confirmPassword) {
      displayMessage = 'Password and Confirmed Password fields do not match.';
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      displayMessage = 'Email is invalid.';
    } else if (!password.match(/(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}/)) {
      displayMessage = 'Password is too weak. Needs to be 6 characters or more. It can be any combination of letters, numbers, and symbols (ASCII characters).';
    } else {
      try {
        setIsSubmitting(true);
        await props.firebase.createUserWithEmailAndPassword(email, password, basicRole, displayName);
        props.history.push('/');
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
    REACT_APP_PWA_NAME
  } = process.env;
  return (
    <div className="register-view bg-panel text-center">
      <Card className="card-login card-plain">
        <Form className="form" onSubmit={handleSubmit} noValidate>
          <CardHeader className="text-center">
            <div className="logo-container">
              <img alt={`${REACT_APP_PWA_NAME}`} src={require("assets/img/tkot/tkot-logo-512x512.png")} />
            </div>
            Regsiter here.
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
            <InputGroup className={`no-border input-lg${(firstFocus && ' input-group-focus') || ''}`}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="text-white now-ui-icons ui-1_email-85"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Confirm Email Address"
                type="email"
                onFocus={() => setFirstFocus(true)}
                onBlur={() => setFirstFocus(false)}
                value={confirmEmail}
                onChange={async e => setConfirmEmail(e.target.value)}
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
            <InputGroup className={`no-border input-lg${(lastFocus && ' input-group-focus') || ''}`}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="now-ui-icons ui-1_lock-circle-open"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Confirm Password"
                type="password"
                onFocus={() => setLastFocus(true)}
                onBlur={() => setLastFocus(false)}
                value={confirmPassword}
                onChange={async e => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              ></Input>
            </InputGroup>
            <InputGroup className={`no-border input-lg${(lastFocus && ' input-group-focus') || ''}`}>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="now-ui-icons business_badge"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Display Name"
                type="text"
                onFocus={() => setLastFocus(true)}
                onBlur={() => setLastFocus(false)}
                value={displayName}
                onChange={async e => setDisplayName(e.target.value)}
                disabled={isSubmitting}
              ></Input>
            </InputGroup>
            <p>
              By clicking Register, you agree to our <Link to="/public/PrivacyPolicy" title="Privacy Policy">Privacy Policy</Link> and <Link to="/public/TermsOfUse" title="Terms of Use">Terms of Use</Link>.
            </p>
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
              Register
            </Button>
          </CardFooter>
          <SweetAlert show={show} title={title} text={text} onConfirm={() => setSweetAlertStates()} />
        </Form>
      </Card>
    </div>
  );
};

export default withFirebase(RegisterView);
