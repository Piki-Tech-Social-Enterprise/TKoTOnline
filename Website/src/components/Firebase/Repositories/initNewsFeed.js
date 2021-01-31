const initNewsFeed = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'newsFeeds'
  });
  const getDbNewsFeeds = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbNewsFeed = async nfid => {
    return await dbRepository.getDbItem(nfid);
  };
  const getDbNewsFeedValue = async nfid => {
    return await dbRepository.getDbItemValue(nfid);
  };
  return {
    dbRepository,
    getDbNewsFeeds,
    getDbNewsFeedsAsArray,
    getDbNewsFeed,
    getDbNewsFeedValue
  };
};

export default initNewsFeed;
