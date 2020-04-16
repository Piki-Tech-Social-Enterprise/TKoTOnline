import React, {
  useContext
} from 'react';

const AuthUserContext = React.createContext(null);
const useAuthUserContext = () => {
  return useContext(AuthUserContext);
}

export default AuthUserContext;
export {
  useAuthUserContext
};
