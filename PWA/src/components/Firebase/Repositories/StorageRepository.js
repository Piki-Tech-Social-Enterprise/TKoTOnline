import BaseRepository from './BaseRepository';
import 'firebase/compat/storage';
import {
  isBoolean,
  isNumber
} from '../../App/Utilities';

class StorageRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.storage = firebaseApp.storage();
    const {
      REACT_APP_USE_EMULATOR,
      REACT_APP_STRG_PORT
    } = process.env;
    if (isBoolean(REACT_APP_USE_EMULATOR, true) && isNumber(REACT_APP_STRG_PORT)) {
      this.storage.useEmulator('localhost', Number(REACT_APP_STRG_PORT));
      console.log(`StorageRepository.storage.useEmulator is set to: 'localhost:${REACT_APP_STRG_PORT}'`);
    }
  }

  getStorageFileRef = path => {
    return this.storage.ref().child(path);
  }

  getStorageFileDownloadURL = async path => {
    return await this.getStorageFileRef(path).getDownloadURL();
  }

  saveStorageFile = async (path, file) => {
    return await this.getStorageFileRef(path).put(file);
  }

  deleteStorageFile = async (path) => {
    return await this.getStorageFileRef(path).delete();
  }

  getStorageFiles = async (path, listOptions) => {
    return await this.getStorageFileRef(path).list(listOptions);
  }
}

export default StorageRepository;
