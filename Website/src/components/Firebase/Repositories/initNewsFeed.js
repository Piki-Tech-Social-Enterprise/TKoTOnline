const initNewsFeed = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'newsFeeds'
  });
  const getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbNewsFeedValue = async (nfid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(nfid, fieldNames);
  };
  return {
    dbRepository,
    getDbNewsFeedsAsArray,
    getDbNewsFeedValue
  };
};

export default initNewsFeed;
