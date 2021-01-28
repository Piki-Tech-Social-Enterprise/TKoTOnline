const initEconomicDevelopments = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbEconomicDevelopments = async () => {
    return await database.ref('economicDevelopments');
  };
  const getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbEconomicDevelopments = await getDbEconomicDevelopments();
    const dbEconomicDevelopmentsRef = !includeInactive
      ? await existingDbEconomicDevelopments
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbEconomicDevelopments
        .orderByChild(childName)
        .once('value');
    const dbEconomicDevelopments = await dbEconomicDevelopmentsRef.val();
    const dbEconomicDevelopmentsAsArray = [];
    if (dbEconomicDevelopments) {
      Object.keys(dbEconomicDevelopments).map(key =>
        dbEconomicDevelopmentsAsArray.push(dbEconomicDevelopments[key])
      );
    }
    return dbEconomicDevelopmentsAsArray.filter(c => includeInactive || c.active);
  };
  const getDbEconomicDevelopment = async edid => {
    return await database.ref(`economicDevelopments/${edid}`);
  };
  const getDbEconomicDevelopmentValue = async edid => {
    const existingDbEconomicDevelopment = await getDbEconomicDevelopment(edid);
    const dbEconomicDevelopmentRef = await existingDbEconomicDevelopment.once('value');
    const dbEconomicDevelopment = await dbEconomicDevelopmentRef.val();
    return dbEconomicDevelopment;
  };
  return {
    getDbEconomicDevelopments,
    getDbEconomicDevelopmentsAsArray,
    getDbEconomicDevelopment,
    getDbEconomicDevelopmentValue
  };
};

export default initEconomicDevelopments;
