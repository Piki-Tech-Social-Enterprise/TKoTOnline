import React, {
  useState
} from 'react';
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
import 'assets/css/now-ui-kit.css';

const LoginView = () => {
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  return (
    <Card className="card-login card-plain">
      <Form action="" className="form" method="">
        <CardHeader className="text-center">
          <div className="logo-container">
            <img
              alt="..."
              src={require("assets/img/tkot/now-logo.png")}
            ></img>
          </div>
        </CardHeader>
        <CardBody>
          <InputGroup
            className={
              "no-border input-lg" +
              (firstFocus ? " input-group-focus" : "")
            }
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="now-ui-icons users_circle-08"></i>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="First Name..."
              type="text"
              onFocus={() => setFirstFocus(true)}
              onBlur={() => setFirstFocus(false)}
            ></Input>
          </InputGroup>
          <InputGroup
            className={
              "no-border input-lg" +
              (lastFocus ? " input-group-focus" : "")
            }
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="now-ui-icons text_caps-small"></i>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Last Name..."
              type="text"
              onFocus={() => setLastFocus(true)}
              onBlur={() => setLastFocus(false)}
            ></Input>
          </InputGroup>
        </CardBody>
        <CardFooter className="text-center">
          <Button
            block
            className="btn-round"
            color="info"
            href="#pablo"
            onClick={e => e.preventDefault()}
            size="lg"
          >
            Get Started
          </Button>
          <div className="pull-left">
            <h6>
              <a
                className="link"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                Create Account
              </a>
            </h6>
          </div>
          <div className="pull-right">
            <h6>
              <a
                className="link"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                Need Help?
              </a>
            </h6>
          </div>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default LoginView
