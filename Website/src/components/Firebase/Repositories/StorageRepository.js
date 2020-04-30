import BaseRepository from './BaseRepository';
import 'firebase/storage';

class StorageRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.storage = firebaseApp.storage();
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
