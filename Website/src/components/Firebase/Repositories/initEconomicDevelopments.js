const initEconomicDevelopment = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'economicDevelopments'
  });
  const getDbEconomicDevelopments = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbEconomicDevelopment = async edid => {
    return await dbRepository.getDbItem(edid);
  };
  const getDbEconomicDevelopmentValue = async edid => {
    return await dbRepository.getDbItemValue(edid);
  };
  return {
    dbRepository,
    getDbEconomicDevelopments,
    getDbEconomicDevelopmentsAsArray,
    getDbEconomicDevelopment,
    getDbEconomicDevelopmentValue
  };
};

export default initEconomicDevelopment;
