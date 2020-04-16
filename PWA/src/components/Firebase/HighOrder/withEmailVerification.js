import React from 'react';
import AuthUserContext from '../../Firebase/Contexts/authUserContext';
import {
  withFirebase
} from '../../Firebase/Contexts/firebaseContext';
import EmailVerificationView from '../Views/EmailVerificationView';

const needsEmailVerificationCondition = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider =>
      provider.providerId)
    .includes('password');
const withEmailVerification = Component => {
  const WithEmailVerification = props => {
    return (
      <AuthUserContext.Consumer>
        {
          authUser =>
            needsEmailVerificationCondition(authUser)
              ? <EmailVerificationView />
              : <Component {...props} />
        }
      </AuthUserContext.Consumer>
    );
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
