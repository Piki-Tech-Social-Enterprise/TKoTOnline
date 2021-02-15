const initStorage = async initialisedFirebaseApp => {
  await import(/* webpackPrefetch: true */'firebase/storage');
  const storage = initialisedFirebaseApp.storage();
  const getStorageFileRef = path => {
    return storage.ref().child(path);
  };
  const getStorageFileDownloadURL = async path => {
    const {
      join
    } = await import('path');
    const {
      REACT_APP_FIREBASE_STORAGE_BUCKET,
      REACT_APP_FIREBASE_STORAGE_PUBLIC_BASEURL
    } = process.env;
    const storagePath = join(REACT_APP_FIREBASE_STORAGE_BUCKET, path);
    const storageFileDownloadURL = new URL(storagePath, REACT_APP_FIREBASE_STORAGE_PUBLIC_BASEURL);
    return storageFileDownloadURL.toString();
    // return await getStorageFileRef(path).getDownloadURL();
  };
  const saveStorageFile = async (path, file) => {
    return await getStorageFileRef(path).put(file);
  };
  const deleteStorageFile = async (path) => {
    return await getStorageFileRef(path).delete();
  };
  const getStorageFiles = async (path, listOptions) => {
    return await getStorageFileRef(path).list(listOptions);
  };
  return {
    getStorageFileRef,
    getStorageFileDownloadURL,
    saveStorageFile,
    deleteStorageFile,
    getStorageFiles
  };
};

export default initStorage;
