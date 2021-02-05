const initEconomicDevelopment = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'economicDevelopments'
  });
  const getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbEconomicDevelopmentValue = async (edid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(edid, fieldNames);
  };
  return {
    dbRepository,
    getDbEconomicDevelopmentsAsArray,
    getDbEconomicDevelopmentValue
  };
};

export default initEconomicDevelopment;
