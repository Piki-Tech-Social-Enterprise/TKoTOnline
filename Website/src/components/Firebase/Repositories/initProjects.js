const initProjects = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'projects'
  });
  const getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbProjectValue = async (pid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(pid, fieldNames);
  };
  return {
    dbRepository,
    getDbProjectsAsArray,
    getDbProjectValue
  };
};

export default initProjects;
