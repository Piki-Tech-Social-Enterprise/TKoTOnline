const initCovid = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-repositories-db-repository' */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'covidList'
  });
  const getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbCovidValue = async (cvid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(cvid, fieldNames);
  };
  return {
    dbRepository,
    getDbCovidListAsArray,
    getDbCovidValue
  };
};

export default initCovid;
