const initStorage = async initialisedFirebaseApp => {
  const {
    isBoolean,
    isNumber
  } = await import(/* webpackPreload: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
  await import(/* webpackPrefetch: true, webpackChunkName: 'firebase-storage' */'firebase/compat/storage');
  const storage = initialisedFirebaseApp.storage();
  const {
    REACT_APP_USE_EMULATOR,
    REACT_APP_STRG_PORT
  } = process.env;
  if (isBoolean(REACT_APP_USE_EMULATOR, true) && isNumber(REACT_APP_STRG_PORT)) {
    storage.useEmulator('localhost', Number(REACT_APP_STRG_PORT));
    console.log(`initStorage.storage.useEmulator is set to: 'localhost:${REACT_APP_STRG_PORT}'`);
  }
  const getStorageFileRef = path => {
    return storage.ref().child(path);
  };
  const getStorageFileDownloadURL = async path => {
    const {
      join
    } = await import(/* webpackPrefetch: true, webpackChunkName: 'path' */'path');
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
