import React, {
  useState,
  useEffect
} from 'react';
import {
  withRouter
} from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import {
  compose
} from 'recompose';
import AuthUserContext from '../../Firebase/Contexts/authUserContext';
import {
  withFirebase
} from '../../Firebase/Contexts/firebaseContext';
import LoadingOverlayModal from '../../App/LoadingOverlayModal';
import SendUsAnEmail from '../../App/SendUsAnEmail';
import CopyrightInfomation from '../../App/CopyrightInfomation';

const withAuthorization = condition => Component => {
  const WithAuthorization = props => {
    const [isLoading, setIsLoading] = useState(true);
    const {
      REACT_APP_PWA_NAME,
      REACT_APP_PWA_EMAIL
    } = process.env;
    useEffect(() => {
      let listener = null;
      (async function useEffectAsync() {
        listener = await props.firebase.authUserListener(authUser => {
          if (!authUser || !condition(authUser)) {
            props.history.push('/public/Login');
          }
        }, () => {
          props.history.push('/public/Login');
        });
        setIsLoading(false);
      })();
      return () => {
        if (!isLoading && typeof listener === 'function') {
          listener();
          listener = null;
        }
      };
    }, [props, isLoading]);
    return (
      <AuthUserContext.Consumer>
        {
          authUser =>
            isLoading
              ? <LoadingOverlayModal color="text-secondary" />
              : condition(authUser)
                ? <Component {...props} authUser={authUser} />
                : <>
                  <Container className="mt-4">
                    <Row>
                      <Col className="mx-auto" md="8">
                        <Card className="no-transition">
                          <CardHeader>
                            <h1 className="text-danger">{REACT_APP_PWA_NAME} Access Denied!</h1>
                          </CardHeader>
                          <CardBody>
                            <h3>
                              Need to discuss your options? Send us an email so we know.{' '}
                              <SendUsAnEmail email={REACT_APP_PWA_EMAIL} subject={`${REACT_APP_PWA_NAME} Access Denied!`} className="text-info" />
                            </h3>
                            <CopyrightInfomation />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </>
        }
      </AuthUserContext.Consumer>
    );
  };
  // console.log(`withRouter: ${typeof withRouter}, withFirebase: ${typeof withFirebase}, WithAuthorization: ${typeof WithAuthorization}`);
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
