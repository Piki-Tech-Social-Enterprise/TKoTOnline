const initEvents = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'events'
  });
  const getDbEvents = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbEventsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbEvent = async eid => {
    return await dbRepository.getDbItem(eid);
  };
  const getDbEventValue = async eid => {
    return await dbRepository.getDbItemValue(eid);
  };
  return {
    dbRepository,
    getDbEvents,
    getDbEventsAsArray,
    getDbEvent,
    getDbEventValue
  };
};

export default initEvents;
