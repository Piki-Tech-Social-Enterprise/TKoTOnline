const initStorage = async initialisedFirebaseApp => {
  await import('firebase/storage');
  const storage = initialisedFirebaseApp.storage();
  const getStorageFileRef = path => {
    return storage.ref().child(path);
  };
  const getStorageFileDownloadURL = async path => {
    return await getStorageFileRef(path).getDownloadURL();
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
