const initIwiMember = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'iwiMembers'
  });
  const getDbIwiMembers = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbIwiMember = async imid => {
    return await dbRepository.getDbItem(imid);
  };
  const getDbIwiMemberValue = async imid => {
    return await dbRepository.getDbItemValue(imid);
  };
  return {
    dbRepository,
    getDbIwiMembers,
    getDbIwiMembersAsArray,
    getDbIwiMember,
    getDbIwiMemberValue
  };
};

export default initIwiMember;
