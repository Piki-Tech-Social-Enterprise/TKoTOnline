const initFacebookLinks = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'facebookLinks'
  });
  const getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbFacebookLinkValue = async (fid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(fid, fieldNames);
  };
  return {
    dbRepository,
    getDbFacebookLinksAsArray,
    getDbFacebookLinkValue
  };
};

export default initFacebookLinks;
