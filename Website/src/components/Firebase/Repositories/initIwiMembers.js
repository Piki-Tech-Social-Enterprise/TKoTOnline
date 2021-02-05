const initIwiMember = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'iwiMembers'
  });
  const getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbIwiMemberValue = async (imid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(imid, fieldNames);
  };
  return {
    dbRepository,
    getDbIwiMembersAsArray,
    getDbIwiMemberValue
  };
};

export default initIwiMember;
