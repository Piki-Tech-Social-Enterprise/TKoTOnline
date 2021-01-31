const initProjects = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'projects'
  });
  const getDbProjects = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbProject = async pid => {
    return await dbRepository.getDbItem(pid);
  };
  const getDbProjectValue = async pid => {
    return await dbRepository.getDbItemValue(pid);
  };
  return {
    dbRepository,
    getDbProjects,
    getDbProjectsAsArray,
    getDbProject,
    getDbProjectValue
  };
};

export default initProjects;
