const initFacebookLinks = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'facebookLinks'
  });
  const getDbFacebookLinks = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbFacebookLink = async fid => {
    return await dbRepository.getDbItem(fid);
  };
  const getDbFacebookLinkValue = async fid => {
    return await dbRepository.getDbItemValue(fid);
  };
  return {
    dbRepository,
    getDbFacebookLinks,
    getDbFacebookLinksAsArray,
    getDbFacebookLink,
    getDbFacebookLinkValue
  };
};

export default initFacebookLinks;
