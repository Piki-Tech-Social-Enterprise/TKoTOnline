const initContact = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-repositories-db-repository' */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'contacts',
    useSDKDatabase: true
  });
  const getDbContactsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbContactValue = async (cid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(cid, fieldNames);
  };
  const saveDbContact = async contact => {
    return await dbRepository.saveDbItem(contact);
  }
  return {
    dbRepository,
    getDbContactsAsArray,
    getDbContactValue,
    saveDbContact
  };
};

export default initContact;
