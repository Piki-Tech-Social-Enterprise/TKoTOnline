const initCovid = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'covidList'
  });
  const getDbCovidList = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbCovid = async cvid => {
    return await dbRepository.getDbItem(cvid);
  };
  const getDbCovidValue = async cvid => {
    return await dbRepository.getDbItemValue(cvid);
  };
  return {
    dbRepository,
    getDbCovidList,
    getDbCovidListAsArray,
    getDbCovid,
    getDbCovidValue
  };
};

export default initCovid;
