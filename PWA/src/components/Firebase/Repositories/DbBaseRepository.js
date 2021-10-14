import 'firebase/compat/database';
import {
  isBoolean,
  isNumber
} from 'components/App/Utilities';
class DbBaseRepository {
  constructor(firebaseApp) {
    this.db = firebaseApp.database();
    const {
      REACT_APP_USE_EMULATOR,
      REACT_APP_DTB_PORT
    } = process.env;
    if (isBoolean(REACT_APP_USE_EMULATOR, true) && isNumber(REACT_APP_DTB_PORT)) { // && this.db._delegate._repoInternal.repoInfo_._host !== `localhost:${REACT_APP_DTB_PORT}`) {
      this.db.useEmulator('localhost', Number(REACT_APP_DTB_PORT));
      console.log(`DbBaseRepository.db.useEmulator is set to: 'localhost:${REACT_APP_DTB_PORT}'`);
    }
  }
}

export default DbBaseRepository;
