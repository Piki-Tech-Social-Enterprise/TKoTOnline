import Firebase from './firebase';
import FirebaseContext, {
  withFirebase
}  from './Contexts/firebaseContext';
import AuthUserContext, {
  useAuthUserContext
} from './Contexts/authUserContext';
import withAuthentication from './HighOrder/withAuthentication';
import withAuthorization from './HighOrder/withAuthorization';
import withEmailVerification from './HighOrder/withEmailVerification';

export default Firebase;
export {
    FirebaseContext,
    withFirebase,
    AuthUserContext,
    useAuthUserContext,
    withAuthentication,
    withAuthorization,
    withEmailVerification
};
