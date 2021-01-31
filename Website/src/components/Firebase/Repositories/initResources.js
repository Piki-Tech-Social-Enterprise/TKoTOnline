const initResources = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'resources'
  });
  const getDbResources = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbResource = async rid => {
    return await dbRepository.getDbItem(rid);
  };
  const getDbResourceValue = async rid => {
    return await dbRepository.getDbItemValue(rid);
  };
  return {
    dbRepository,
    getDbResources,
    getDbResourcesAsArray,
    getDbResource,
    getDbResourceValue
  };
};

export default initResources;
