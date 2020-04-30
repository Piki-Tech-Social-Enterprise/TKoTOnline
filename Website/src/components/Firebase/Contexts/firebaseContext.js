import React, {
  createContext
} from 'react';

const FirebaseContext = createContext(null);
const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {
      firebase =>
        <Component {...props} firebase={firebase} />
    }
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
export {
  withFirebase
};
