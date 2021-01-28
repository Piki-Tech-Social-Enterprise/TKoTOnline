const initIwiMembers = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbIwiMembers = async () => {
    return await database.ref('iwiMembers');
  };
  const getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbIwiMembers = await getDbIwiMembers();
    const dbIwiMembersRef = !includeInactive
      ? await existingDbIwiMembers
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbIwiMembers
        .orderByChild(childName)
        .once('value');
    const dbIwiMembers = await dbIwiMembersRef.val();
    const dbIwiMembersAsArray = [];
    if (dbIwiMembers) {
      Object.keys(dbIwiMembers).map(key =>
        dbIwiMembersAsArray.push(dbIwiMembers[key])
      );
    }
    return dbIwiMembersAsArray.filter(c => includeInactive || c.active);
  };
  const getDbIwiMember = async imid => {
    return await database.ref(`iwiMembers/${imid}`);
  };
  const getDbIwiMemberValue = async imid => {
    const existingDbIwiMember = await getDbIwiMember(imid);
    const dbIwiMemberRef = await existingDbIwiMember.once('value');
    const dbIwiMember = await dbIwiMemberRef.val();
    return dbIwiMember;
  };
  return {
    getDbIwiMembers,
    getDbIwiMembersAsArray,
    getDbIwiMember,
    getDbIwiMemberValue
  };
};

export default initIwiMembers;
