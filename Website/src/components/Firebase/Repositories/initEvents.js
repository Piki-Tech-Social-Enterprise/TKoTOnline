const initEvents = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'events'
  });
  const getDbEventsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbEventValue = async (eid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(eid, fieldNames);
  };
  return {
    dbRepository,
    getDbEventsAsArray,
    getDbEventValue
  };
};

export default initEvents;
