import React, {
  useState,
  useEffect
} from 'react';
import AuthUserContext from '../../Firebase/Contexts/authUserContext';
import {
  withFirebase
} from '../../Firebase/Contexts/firebaseContext';
import LoadingOverlayModal from '../../App/LoadingOverlayModal';

const withAuthentication = Component => {
  const localStorageItemId = 'authUser';
  const WithAuthentication = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem(localStorageItemId)));
    useEffect(() => {
      let listener = null;
      setIsLoading(true);
      (async function useEffectAsync() {
        listener = await props.firebase.authUserListener(authUser => {
          localStorage.setItem(localStorageItemId, JSON.stringify(authUser));
          setAuthUser(authUser);
        }, () => {
          localStorage.removeItem(localStorageItemId);
          setAuthUser(null);
        })
      })();
      setIsLoading(false);
      return () => {
        listener && listener();
      };
    }, [props, setAuthUser]);
    return (
      <>
        {
          isLoading
            ? <LoadingOverlayModal />
            : <>
              <AuthUserContext.Provider value={authUser}>
                <Component {...props} />
              </AuthUserContext.Provider>
            </>
        }
      </>
    );
  }
  // console.log(`withFirebase: ${typeof withFirebase}, WithAuthentication: ${typeof WithAuthentication}`);
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
