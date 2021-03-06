const initResources = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-repositories-db-repository' */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'resources'
  });
  const getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbResourceValue = async (rid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(rid, fieldNames);
  };
  return {
    dbRepository,
    getDbResourcesAsArray,
    getDbResourceValue
  };
};

export default initResources;
